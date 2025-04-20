// src/hooks/useChatApp.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
    ChatState,
    MessageType,
    ChatMessageData,
    ChatAppState,
    ChatAppActions,
    UseChatAppResult,
    MatchData,
    ErrorData
} from '../types/chatTypes'; // Import types

// --- Configuration ---
const WEBSOCKET_ENDPOINT = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/ws/chat";



export function useChatApp(authToken: string | null): UseChatAppResult {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [internalChatState, setInternalChatState] = useState<ChatState>(ChatState.DISCONNECTED);
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [partnerUsername, setPartnerUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
    const stompClientRef = useRef<Client | null>(null);

    const sessionSubscriptionRef = useRef<StompSubscription | null>(null);
    const userQueuesSubscriptionRef = useRef<StompSubscription[]>([]);

    useEffect(() => {
        stompClientRef.current = stompClient;
    }, [stompClient]);// Store user queue subs

    // --- Add Message Helper ---
    const addMessage = useCallback((msg: ChatMessageData) => {
        const messageWithTimestamp: ChatMessageData = {
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
    }, []); // Memoized addMessage

    // --- Reset Chat State ---
    const resetChat = useCallback((disconnectClient = true) => {
        console.log(`Resetting chat state. Disconnect client: ${disconnectClient}`);
        const currentClient = stompClientRef.current;
        if (sessionSubscriptionRef.current) {
            try {
                sessionSubscriptionRef.current.unsubscribe();
                console.log("Unsubscribed from session topic during reset.");
            } catch (e) {
                console.warn("Error unsubscribing from session topic:", e);
            }
            sessionSubscriptionRef.current = null;
        }
        if (disconnectClient) {
            userQueuesSubscriptionRef.current.forEach(sub => {
                try { sub.unsubscribe(); } catch (e) { console.warn("Error unsubscribing user queue:", e); }
            });
            userQueuesSubscriptionRef.current = [];
        }
        setSessionId(null);
        setPartnerUsername(null);
        setMessages([]);
        setNewMessage('');
        // Determine state based on client presence and activity
        const nextState = currentClient?.active ? ChatState.IDLE : ChatState.DISCONNECTED;
        setInternalChatState(nextState);

        if (disconnectClient && currentClient?.active) {
            console.log("Deactivating client during reset.");
            try {
                currentClient.deactivate();
                // setStompClient(null); // Ensure client state is updated
                // setInternalChatState(ChatState.DISCONNECTED);
            } catch (e) {
                console.error("Error deactivating client in resetChat:", e);
                setStompClient(null);
                setInternalChatState(ChatState.DISCONNECTED);
            }
        } else if (!currentClient?.active) {
            // If already disconnected, ensure state reflects it
            setInternalChatState(ChatState.DISCONNECTED);
        }
    }, []); // Depends on stompClient state

    // --- WebSocket Connection Logic ---
    useEffect(() => {
        if (!authToken) {
            setError("Authentication token is missing. Cannot connect.");
            setInternalChatState(ChatState.ERROR);
            return;
        }

        console.log("useChatApp Hook: Attempting WebSocket connection...");
        setInternalChatState(ChatState.CONNECTING);
        setError(null); // Clear previous errors on new connection attempt

        const sockJsUrl = `${WEBSOCKET_ENDPOINT}?token=${authToken}`;
        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl),
            debug: (str) => console.log('STOMP Debug:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: (frame) => {
                console.log('STOMP Connected:', frame);
                setStompClient(client); // Store the active client
                setInternalChatState(ChatState.IDLE);
                setError(null);

                // Clear previous user queue subscriptions if any (important on reconnect)
                userQueuesSubscriptionRef.current.forEach(sub => {
                    try { sub.unsubscribe(); } catch (e) { console.warn("Error unsubscribing user queue:", e); }
                });
                userQueuesSubscriptionRef.current = [];


                // Subscribe to user-specific queues
                const matchSub = client.subscribe('/user/queue/match', (message: IMessage) => {
                    console.log('Match Received:', message.body);
                    try {
                        const matchData = JSON.parse(message.body) as MatchData;
                        if (matchData.sessionId && matchData.partnerUsername) {
                            setSessionId(matchData.sessionId);
                            setPartnerUsername(matchData.partnerUsername);
                            setInternalChatState(ChatState.IN_CHAT);
                            setMessages([]); // Clear messages for new chat

                            addMessage({ type: MessageType.MATCH, content: `🎉 Matched with ${matchData.partnerUsername}!`, senderUsername: 'System' });

                            // Subscribe to the specific chat topic
                            const topic = `/topic/chat.${matchData.sessionId}`;
                            console.log(`Subscribing to session topic: ${topic}`);
                            if (sessionSubscriptionRef.current) {
                                try { sessionSubscriptionRef.current.unsubscribe(); } catch (e) { console.warn("Error unsubscribing prev session:", e); }
                            }
                            sessionSubscriptionRef.current = client.subscribe(topic, handleChatMessage);

                        } else { throw new Error("Invalid match data format"); }
                    } catch (e: any) {
                        console.error("Failed to process match message:", e);
                        addMessage({ type: MessageType.ERROR, content: `Failed to process match notification: ${e.message}`, senderUsername: 'System' });
                        resetChat(false); // Reset to idle if match fails
                    }
                });

                const errorSub = client.subscribe('/user/queue/error', (message: IMessage) => {
                    console.error('Backend Error Received:', message.body);
                    try {
                        const errorData = JSON.parse(message.body) as ErrorData;
                        const errorMessage = errorData.message || `Error: ${errorData.error}`;
                        setError(errorMessage);
                        addMessage({ type: MessageType.ERROR, content: errorMessage, senderUsername: 'System' });

                        if (errorData.error === 'already_in_session') {
                            setSessionId(errorData.sessionId || null);
                            setInternalChatState(ChatState.IDLE); // Go back to idle, user needs to decide action
                            // TODO: Potentially add logic to auto-rejoin if desired
                        } else if (errorData.error === 'not_in_session') {
                            resetChat(false); // Reset to idle
                        } else {
                            setInternalChatState(ChatState.ERROR); // Set general error state
                        }
                    } catch (e: any) {
                        console.error("Failed to parse error message:", e);
                        const genericError = "Received an unparseable error from the server.";
                        setError(genericError);
                        addMessage({ type: MessageType.ERROR, content: genericError, senderUsername: 'System' });
                        setInternalChatState(ChatState.ERROR);
                    }
                });

                userQueuesSubscriptionRef.current.push(matchSub, errorSub);
                console.log("Subscribed to user queues.");
            },

            onStompError: (frame) => {
                const errorMsg = `Broker reported error: ${frame.headers['message']}. Details: ${frame.body}`;
                console.error(errorMsg);
                setError(errorMsg);
                setInternalChatState(ChatState.ERROR);
                // resetChat(false); // Reset state but don't disconnect client yet (it might reconnect)
            },

            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                setError('WebSocket connection error. Attempting to reconnect...');
                // State might be handled by reconnect logic or onDisconnect
                setInternalChatState(ChatState.ERROR); // Reflect error state
                // resetChat(false); // Reset state
            },

            onDisconnect: (frame) => {
                console.log('STOMP Disconnected:', frame);
                // setError('Disconnected from chat service.');
                resetChat(true); // Full reset including client state
            },
        });

        client.activate();
        // setStompClient(client); // Set the client immediately (though not active yet)

        // Cleanup
        return () => {
            console.log("Running useEffect cleanup (before next attempt or unmount)...");
            console.log("useChatApp Hook: Unmounting, deactivating STOMP client...");
            if (client?.active) { // Check if the client instance exists and is active
                try {
                    console.log("Deactivating previous client instance...");
                    client.deactivate();
                    console.log("Previous client instance deactivated.");
                    console.log("STOMP Client deactivated on unmount.");
                } catch (e) {
                    console.error("Error deactivating STOMP client on unmount:", e);
                }
            } else {
                console.log("Previous client instance was not active, no deactivation needed.");
            }
            // Clear subscriptions refs just in case
            // sessionSubscriptionRef.current = null;
            // userQueuesSubscriptionRef.current = [];
            // setStompClient(null); // Clear client state
            // setInternalChatState(ChatState.DISCONNECTED); // Ensure final state is disconnected
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, reconnectAttempt, addMessage, resetChat]); // Include addMessage and resetChat as they are used in handlers

    // --- Manual Reconnect Action ---
    const reconnect = useCallback(() => {
        console.log("Reconnect action triggered.");
        // Incrementing the counter will trigger the useEffect hook
        setReconnectAttempt(prev => prev + 1);
    }, []); // Stable function

    // --- Chat Message Handler ---
    const handleChatMessage = useCallback((message: IMessage) => {
        console.log('Chat Message Received:', message.body);
        try {
            const chatMessage = JSON.parse(message.body) as ChatMessageData;
            addMessage(chatMessage); // Add to messages state

            // Handle LEAVE message indicating session end
            if (chatMessage.type === MessageType.LEAVE && chatMessage.content?.includes("session has ended")) {
                addMessage({ type: MessageType.SYSTEM, content: "Chat partner disconnected. Session ended.", senderUsername: "System" });
                resetChat(false); // Reset to idle, keep connection
            }
        } catch (e: any) {
            console.error("Failed to parse chat message:", e);
            addMessage({ type: MessageType.ERROR, content: `Received unparseable chat message: ${e.message}`, senderUsername: 'System' });
        }
    }, [addMessage, resetChat]); // Depends on addMessage and resetChat

    // --- Action Handlers ---
    const findPartner = useCallback(() => {
        if (stompClient?.connected && internalChatState === ChatState.IDLE) {
            setInternalChatState(ChatState.SEARCHING);
            setError(null);
            setMessages([{ type: MessageType.SYSTEM, content: 'Searching for a partner...', senderUsername: 'System' }]);
            stompClient.publish({ destination: '/app/chat.findPartner', body: '' });
            console.log("Sent findPartner request.");
        } else {
            console.warn("Cannot find partner: Not connected or not in IDLE state.");
            setError("Cannot search for partner now. Check connection status.");
        }
    }, [stompClient, internalChatState]);

    const sendMessage = useCallback((event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault(); // Prevent form submission reload if called from form
        if (stompClient?.connected && internalChatState === ChatState.IN_CHAT && sessionId && newMessage.trim()) {
            const chatMessage: Partial<ChatMessageData> = { // Use Partial as backend sets sender
                type: MessageType.CHAT,
                content: newMessage.trim(),
            };
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });
            console.log("Sent chat message:", chatMessage);
            setNewMessage(''); // Clear input field
        } else {
            console.warn("Cannot send message: Conditions not met.", { connected: stompClient?.connected, state: internalChatState, sessionId, newMessage });
            setError("Cannot send message now.");
        }
    }, [internalChatState, sessionId, newMessage]);

    // --- Hook Return Value ---
    const state: ChatAppState = {
        chatState: internalChatState,
        messages,
        newMessage,
        sessionId,
        partnerUsername,
        error,
        isConnected: stompClient?.connected ?? false,
    };

    const actions: ChatAppActions = {
        findPartner,
        sendMessage,
        setNewMessage, // Pass the state setter directly
        resetChat,
        reconnect
    };

    return { state, actions };
}