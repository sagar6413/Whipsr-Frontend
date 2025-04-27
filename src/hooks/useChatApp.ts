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
    ErrorData,
    InviteCodeResponseData, // Import new type
} from '../types/chatTypes';

// --- Configuration ---
const WEBSOCKET_ENDPOINT = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/ws/chat";

// --- WebSocket Endpoints (from backend ChatWebSocketController) ---
const APP_PREFIX = '/app';
const USER_PREFIX = '/user';
const QUEUE_PREFIX = '/queue';
const TOPIC_PREFIX = '/topic';

const DESTINATION_FIND_PARTNER = `${APP_PREFIX}/chat.findPartner`;
const DESTINATION_SEND_MESSAGE = `${APP_PREFIX}/chat.sendMessage`;
const DESTINATION_CREATE_INVITE = `${APP_PREFIX}/chat.createInvite`; // New
const DESTINATION_JOIN_INVITE = `${APP_PREFIX}/chat.joinWithInvite`; // New

const SUBSCRIBE_USER_MATCH = `${USER_PREFIX}${QUEUE_PREFIX}/match`;
const SUBSCRIBE_USER_ERROR = `${USER_PREFIX}${QUEUE_PREFIX}/errors`; // Corrected path
const SUBSCRIBE_USER_INVITE_CODE = `${USER_PREFIX}${QUEUE_PREFIX}/invite_code`; // New
const SUBSCRIBE_CHAT_TOPIC_PREFIX = `${TOPIC_PREFIX}/chat.`;

// Type for backend chat message DTO
interface ChatMessageDto {
    type: string;
    content: string;
    senderUsername: string;
    timestamp: string;
}

export function useChatApp(authToken: string | null): UseChatAppResult {
    // --- Existing State ---
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [internalChatState, setInternalChatState] = useState<ChatState>(ChatState.DISCONNECTED);
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [partnerUsername, setPartnerUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

    // --- New State for Invites ---
    const [myInviteCode, setMyInviteCode] = useState<string | null>(null);
    const [inviteCodeExpiresIn, setInviteCodeExpiresIn] = useState<number | null>(null);

    // --- Refs ---
    const stompClientRef = useRef<Client | null>(null);
    const sessionSubscriptionRef = useRef<StompSubscription | null>(null);
    const userQueuesSubscriptionRef = useRef<StompSubscription[]>([]);

    // Keep ref in sync with state
    useEffect(() => {
        stompClientRef.current = stompClient;
    }, [stompClient]);

    // --- Add Message Helper ---
    const addMessage = useCallback((msg: ChatMessageData) => {
        const messageWithTimestamp: ChatMessageData = {
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
    }, []);

    // --- Reset Chat State ---
    const resetChat = useCallback((disconnectClient = true) => {
        console.log(`Resetting chat state. Disconnect client: ${disconnectClient}`);
        const currentClient = stompClientRef.current;

        // Unsubscribe from dynamic session topic
        if (sessionSubscriptionRef.current) {
            try {
                sessionSubscriptionRef.current.unsubscribe();
                console.log("Unsubscribed from session topic during reset.");
            } catch (e) { console.warn("Error unsubscribing from session topic:", e); }
            sessionSubscriptionRef.current = null;
        }

        // Unsubscribe from user queues ONLY if disconnecting client
        if (disconnectClient) {
            userQueuesSubscriptionRef.current.forEach(sub => {
                try { sub.unsubscribe(); } catch (e) { console.warn("Error unsubscribing user queue:", e); }
            });
            userQueuesSubscriptionRef.current = [];
            console.log("Unsubscribed from user queues during client disconnect.");
        }

        // Reset core chat state
        setSessionId(null);
        setPartnerUsername(null);
        setMessages([]);
        setNewMessage('');
        setError(null); // Clear errors on reset

        // Reset invite state
        setMyInviteCode(null);
        setInviteCodeExpiresIn(null);

        // Determine next state based on connection status
        const nextState = currentClient?.active ? ChatState.IDLE : ChatState.DISCONNECTED;
        setInternalChatState(nextState);
        console.log("Chat state reset to:", nextState);

        // Deactivate client if requested and active
        if (disconnectClient && currentClient?.active) {
            console.log("Deactivating client during reset.");
            try {
                currentClient.deactivate();
                // Don't set stompClient state here, rely on onDisconnect
            } catch (e) {
                console.error("Error deactivating client in resetChat:", e);
                setStompClient(null); // Force clear client state if deactivate fails badly
                setInternalChatState(ChatState.DISCONNECTED);
            }
        } else if (!currentClient?.active && !disconnectClient) {
            // If client is already inactive but we didn't request disconnect, ensure state is DISCONNECTED
            setInternalChatState(ChatState.DISCONNECTED);
        } else if (!disconnectClient) {
            // If keeping client connected, ensure state is IDLE
            setInternalChatState(ChatState.IDLE);
        }

    }, []); // No dependency on stompClient state directly needed here

    const reconnect = useCallback(() => {
        console.log("Reconnect action triggered.");
        resetChat(true); // Force disconnect and clean slate before reconnect attempt
        setReconnectAttempt(prev => prev + 1); // Trigger useEffect
    }, [resetChat]);

    // --- Chat Message Handler (used by session subscription) ---
    const handleChatMessage = useCallback((message: IMessage) => {
        console.log('Chat Message Received:', message.body);
        try {
            // Backend now sends ChatMessage DTO directly
            const chatMessageDto = JSON.parse(message.body) as ChatMessageDto;

            // Adapt backend DTO to frontend ChatMessageData if necessary
            const chatMessage: ChatMessageData = {
                type: chatMessageDto.type as MessageType, // Assumes enum names match
                content: chatMessageDto.content,
                senderUsername: chatMessageDto.senderUsername,
                timestamp: chatMessageDto.timestamp // Assumes ISO string format from Instant
            };

            addMessage(chatMessage); // Add to messages state
            console.log("hahahahahahahahahahhhaha --", chatMessage.type)

            // Handle specific system messages indicating session end
            if (chatMessage.type === MessageType.LEAVE || chatMessage.type === MessageType.SESSION_ENDED) {
                console.log("Chat message type detected: ", chatMessage.type);

                addMessage({
                    type: MessageType.SYSTEM,
                    content: chatMessage.content || "Chat partner disconnected. Session ended.",
                    senderUsername: "System"
                });
                console.log("System message added: ", chatMessage.content || "Chat partner disconnected. Session ended.");

                reconnect();
                console.log("Reconnect function invoked.");

            }
        } catch (e: unknown) {
            const error = e as Error;
            console.error("Failed to parse chat message:", error);
            addMessage({
                type: MessageType.ERROR,
                content: `Received unparseable chat message: ${error.message}`,
                senderUsername: 'System'
            });
        }
    }, [addMessage, reconnect]); // Depends on addMessage and resetChat


    // --- WebSocket Connection Logic ---
    useEffect(() => {
        if (!authToken) {
            console.log("Auth token missing, skipping connection.");
            setInternalChatState(ChatState.DISCONNECTED); // Explicitly set disconnected
            return;
        }

        console.log("useChatApp Hook: Attempting WebSocket connection...");
        setInternalChatState(ChatState.CONNECTING);
        setError(null);
        setMyInviteCode(null); // Clear invite code on new connection attempt
        setInviteCodeExpiresIn(null);

        // Note: Passing token in header is generally safer than query param
        const sockJsUrl = `${WEBSOCKET_ENDPOINT}?token=${authToken}`; // Less secure
        const client = new Client({
            // brokerURL: `ws://localhost:8080/ws/chat`, // If not using SockJS directly
            webSocketFactory: () => new SockJS(sockJsUrl), // SockJS handles URL internally
            connectHeaders: {
                Authorization: `Bearer ${authToken}`, // Standard way to pass token
                // Add other headers if needed
            },
            debug: (str) => { if (process.env.NODE_ENV === 'development') console.log('STOMP Debug:', str); },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000, // Increased heartbeat
            heartbeatOutgoing: 10000,

            onConnect: (frame) => {
                console.log('STOMP Connected:', frame);
                setStompClient(client);
                setInternalChatState(ChatState.IDLE);
                setError(null);

                // --- Subscribe to User-Specific Queues ---
                console.log("Subscribing to user queues...");
                // Clear previous user queue subscriptions (important on reconnect)
                userQueuesSubscriptionRef.current.forEach(sub => {
                    try { sub.unsubscribe(); } catch (e) { console.warn("Error unsubscribing stale user queue:", e); }
                });
                userQueuesSubscriptionRef.current = [];

                // 1. Match Queue
                const matchSub = client.subscribe(SUBSCRIBE_USER_MATCH, (message: IMessage) => {
                    console.log('Match Received:', message.body);
                    try {
                        const matchData = JSON.parse(message.body) as MatchData;
                        if (matchData.sessionId && matchData.partnerUsername) {
                            setSessionId(matchData.sessionId);
                            setPartnerUsername(matchData.partnerUsername);
                            setMessages([]); // Clear messages for new chat
                            setMyInviteCode(null); // Clear any invite code state
                            setInviteCodeExpiresIn(null);
                            setInternalChatState(ChatState.IN_CHAT); // <-- Move to IN_CHAT state

                            addMessage({ type: MessageType.MATCH, content: `🎉 Matched with ${matchData.partnerUsername}!`, senderUsername: 'System' });

                            // Subscribe to the specific chat session topic
                            const topic = `${SUBSCRIBE_CHAT_TOPIC_PREFIX}${matchData.sessionId}`;
                            console.log(`Subscribing to session topic: ${topic}`);
                            if (sessionSubscriptionRef.current) {
                                try { sessionSubscriptionRef.current.unsubscribe(); } catch (e) { console.warn("Error unsubscribing prev session:", e); }
                            }
                            sessionSubscriptionRef.current = client.subscribe(topic, handleChatMessage);

                        } else { throw new Error("Invalid match data format"); }
                    } catch (e: unknown) {
                        const error = e as Error;
                        console.error("Failed to process match message:", error);
                        addMessage({
                            type: MessageType.ERROR,
                            content: `Failed to process match notification: ${error.message}`,
                            senderUsername: 'System'
                        });
                        setError(`Failed to process match notification: ${error.message}`);
                        resetChat(false); // Reset to idle if match fails
                    }
                });

                // 2. Error Queue
                const errorSub = client.subscribe(SUBSCRIBE_USER_ERROR, (message: IMessage) => {
                    console.error('Backend Error Received:', message.body);
                    try {
                        const errorData = JSON.parse(message.body) as ErrorData;
                        const errorMessage = errorData.message || `Error code: ${errorData.error}`;
                        setError(errorMessage); // Set error state for UI display
                        addMessage({ type: MessageType.ERROR, content: errorMessage, senderUsername: 'System' });

                        // Handle specific errors to potentially reset state
                        switch (errorData.error) {
                            case 'ALREADY_IN_SESSION':
                                // User tried an action (like find/create invite) while already in a session
                                // Should ideally not happen if UI prevents it, but handle defensively.
                                setSessionId(errorData.sessionId || null); // Store session if provided
                                setInternalChatState(ChatState.IN_CHAT); // Force state to IN_CHAT if we have session ID
                                break;
                            case 'NOT_IN_SESSION':
                                // User tried sending message when not in session (e.g., after partner dc'd)
                                resetChat(false); // Reset to IDLE
                                break;
                            case 'INVALID_INVITE_CODE':
                            case 'CODE_GENERATION_FAILED':
                            case 'CODE_STORAGE_FAILED':
                            case 'SELF_JOIN_INVITE':
                                // Invite related errors, usually just need to inform user
                                setInternalChatState(ChatState.IDLE); // Go back to IDLE so user can retry/choose other option
                                setMyInviteCode(null); // Clear any local invite code state
                                setInviteCodeExpiresIn(null);
                                break;
                            default:
                                // General error, might keep connection but show error
                                // Consider if specific errors should force disconnect/reset
                                setInternalChatState(ChatState.ERROR); // Indicate an error state
                                break;
                        }
                    } catch (e: unknown) {
                        const error = e as Error;
                        console.error("Failed to parse error message:", error);
                        const genericError = "Received an unparseable error from the server.";
                        setError(genericError);
                        addMessage({ type: MessageType.ERROR, content: genericError, senderUsername: 'System' });
                        setInternalChatState(ChatState.ERROR);
                    }
                });

                // 3. Invite Code Queue (NEW)
                const inviteCodeSub = client.subscribe(SUBSCRIBE_USER_INVITE_CODE, (message: IMessage) => {
                    console.log('Invite Code Received:', message.body);
                    try {
                        const inviteData = JSON.parse(message.body) as InviteCodeResponseData;
                        if (inviteData.inviteCode && inviteData.expiresInSeconds > 0) {
                            setMyInviteCode(inviteData.inviteCode);
                            setInviteCodeExpiresIn(inviteData.expiresInSeconds);
                            setInternalChatState(ChatState.WAITING_WITH_INVITE); // New state: Waiting for someone to join
                            setError(null); // Clear any previous errors

                            // Add a system message informing the user
                            addMessage({
                                type: MessageType.INVITE_CODE, // Use specific type
                                content: `Your invite code is ${inviteData.inviteCode}. It expires in ${inviteData.expiresInSeconds} seconds.`,
                                senderUsername: 'System',
                                inviteCode: inviteData.inviteCode, // Pass data for potential UI use
                                expiresInSeconds: inviteData.expiresInSeconds
                            });
                        } else { throw new Error("Invalid invite code data format"); }
                    } catch (e: unknown) {
                        const error = e as Error;
                        console.error("Failed to process invite code message:", error);
                        setError(`Failed to process invite code: ${error.message}`);
                        addMessage({
                            type: MessageType.ERROR,
                            content: `Failed to process invite code: ${error.message}`,
                            senderUsername: 'System'
                        });
                        setInternalChatState(ChatState.IDLE); // Revert to IDLE on failure
                    }
                });


                userQueuesSubscriptionRef.current.push(matchSub, errorSub, inviteCodeSub); // Add new subscription
                console.log("Finished subscribing to user queues.");
            },

            onStompError: (frame) => {
                const errorMsg = `Broker reported error: ${frame.headers['message']}. Details: ${frame.body}`;
                console.error(errorMsg);
                setError(errorMsg);
                setInternalChatState(ChatState.ERROR);
                // Don't reset client here, it might attempt reconnect based on stompjs config
            },

            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                setError('WebSocket connection error. Attempting to reconnect...');
                // State change might be handled by onDisconnect or reconnect logic
                setInternalChatState(ChatState.ERROR); // Reflect error state
            },

            onDisconnect: (frame) => {
                console.log('STOMP Disconnected:', frame);
                setError('Disconnected from chat service.'); // Set error on disconnect
                resetChat(true); // Perform full reset, including state to DISCONNECTED
            },
        });

        client.activate();

        // Cleanup function
        return () => {
            console.log("Running useEffect cleanup (before next attempt or unmount)...");
            if (client?.active) {
                console.log("Deactivating STOMP client...");
                try {
                    client.deactivate();
                    console.log("STOMP Client deactivated.");
                } catch (e) {
                    console.error("Error deactivating STOMP client on cleanup:", e);
                }
            } else {
                console.log("Client was not active, no deactivation needed.");
            }
            // Explicitly clear refs and state on unmount/re-run
            sessionSubscriptionRef.current = null;
            userQueuesSubscriptionRef.current = [];
            stompClientRef.current = null;
            setStompClient(null); // Clear client state
            // Don't force DISCONNECTED here, let onDisconnect handle it or next effect run set CONNECTING
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, reconnectAttempt]); // Removed addMessage, resetChat, handleChatMessage - they are stable useCallback refs


    // --- Manual Reconnect Action ---


    // --- Action Handlers ---
    const findPartner = useCallback(() => {
        console.log("findPartner function invoked."); // Log the start of the function

        if (stompClientRef.current?.connected && internalChatState === ChatState.IDLE) {
            console.log("Conditions met: Client is connected and state is IDLE.");

            setInternalChatState(ChatState.SEARCHING);
            console.log("Chat state set to SEARCHING.");

            setError(null);
            console.log("Error state cleared.");

            setMyInviteCode(null); // Clear invite state if starting random search
            console.log("Invite code state cleared.");

            setInviteCodeExpiresIn(null);
            console.log("Invite code expiry reset.");

            setMessages([{
                type: MessageType.SYSTEM,
                content: 'Searching for a random partner...',
                senderUsername: 'System'
            }]);
            console.log("Messages updated: Added 'Searching for a random partner...'");

            stompClientRef.current.publish({ destination: DESTINATION_FIND_PARTNER });
            console.log("Published to destination: " + DESTINATION_FIND_PARTNER);
        } else {
            console.warn("Cannot find partner: Conditions not met.", {
                state: internalChatState,
                connected: stompClientRef.current?.connected
            });
            setError("Cannot search for partner now. Ensure you are connected and not busy.");
            console.log("Error state set with message: 'Cannot search for partner now...'");
        }
    }, [internalChatState]);// Depends on internalChatState

    const createInvite = useCallback(() => {
        if (stompClientRef.current?.connected && internalChatState === ChatState.IDLE) {
            setInternalChatState(ChatState.CREATING_INVITE); // Indicate waiting for code
            setError(null);
            setMyInviteCode(null); // Clear previous code
            setInviteCodeExpiresIn(null);
            setMessages([{ type: MessageType.SYSTEM, content: 'Generating invite code...', senderUsername: 'System' }]);
            stompClientRef.current.publish({ destination: DESTINATION_CREATE_INVITE });
            console.log("Sent createInvite request.");
        } else {
            console.warn("Cannot create invite: Conditions not met.", { state: internalChatState, connected: stompClientRef.current?.connected });
            setError("Cannot create invite now. Ensure you are connected and not busy.");
        }
    }, [internalChatState]); // Depends on internalChatState

    const joinWithInvite = useCallback((inviteCode: string) => {
        const trimmedCode = inviteCode.trim();
        if (!trimmedCode) {
            setError("Please enter an invite code.");
            return;
        }
        if (stompClientRef.current?.connected && internalChatState === ChatState.IDLE) {
            setInternalChatState(ChatState.JOINING_INVITE); // Indicate trying to join
            setError(null);
            setMyInviteCode(null); // Clear own invite state if trying to join another
            setInviteCodeExpiresIn(null);
            setMessages([{ type: MessageType.SYSTEM, content: `Attempting to join with code ${trimmedCode}...`, senderUsername: 'System' }]);
            stompClientRef.current.publish({
                destination: DESTINATION_JOIN_INVITE,
                body: JSON.stringify({ inviteCode: trimmedCode }),
            });
            console.log(`Sent joinWithInvite request with code: ${trimmedCode}`);
        } else {
            console.warn("Cannot join with invite: Conditions not met.", { state: internalChatState, connected: stompClientRef.current?.connected });
            setError("Cannot join with invite now. Ensure you are connected and not busy.");
        }
    }, [internalChatState]); // Depends on internalChatState

    const sendMessage = useCallback((event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const messageContent = newMessage.trim();
        if (stompClientRef.current?.connected && internalChatState === ChatState.IN_CHAT && sessionId && messageContent) {
            const chatMessage = { // Backend expects ChatMessage DTO structure
                // type: MessageType.CHAT, // Type is set server-side or inferred usually
                content: messageContent,
                // senderUsername: is set server-side based on Principal
                // timestamp: is set server-side
            };
            stompClientRef.current.publish({
                destination: DESTINATION_SEND_MESSAGE,
                body: JSON.stringify(chatMessage),
            });
            // console.log("Sent chat message:", chatMessage);
            setNewMessage(''); // Clear input field
        } else {
            console.warn("Cannot send message: Conditions not met.", { connected: stompClientRef.current?.connected, state: internalChatState, sessionId, messageContent });
            // Avoid setting error here, could be annoying if user just hasn't typed yet
        }
    }, [internalChatState, sessionId, newMessage]); // Depends on relevant state

    // --- Hook Return Value ---
    const state: ChatAppState = {
        chatState: internalChatState,
        messages,
        newMessage,
        sessionId,
        partnerUsername,
        error,
        isConnected: stompClient?.connected ?? false,
        myInviteCode, // Expose invite code state
        inviteCodeExpiresIn // Expose expiry state
    };

    const actions: ChatAppActions = {
        findPartner,
        createInvite, // Expose new action
        joinWithInvite, // Expose new action
        sendMessage,
        setNewMessage,
        resetChat,
        reconnect,
        // cancelInvite: () => { /* TODO: Implement if needed */ },
    };

    return { state, actions };
}