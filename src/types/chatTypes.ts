// src/chatTypes.ts

export enum ChatState {
    IDLE = 'IDLE',
    SEARCHING = 'SEARCHING',
    IN_CHAT = 'IN_CHAT',
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    ERROR = 'ERROR',
}

export enum MessageType {
    CHAT = 'CHAT',
    JOIN = 'JOIN',
    LEAVE = 'LEAVE',
    TYPING = 'TYPING',
    SYSTEM = 'SYSTEM',
    MATCH = 'MATCH', // Custom type for match notification display
    ERROR = 'ERROR', // Custom type for error display
}

// Interface for messages coming from the backend or generated locally
export interface ChatMessageData {
    type: MessageType;
    content: string;
    senderUsername?: string; // Optional as backend might omit for system messages
    timestamp?: string; // Optional as we might add it locally
}

// Interface for the state managed by the hook
export interface ChatAppState {
    chatState: ChatState;
    messages: ChatMessageData[];
    newMessage: string;
    sessionId: string | null;
    partnerUsername: string | null;
    error: string | null;
    isConnected: boolean; // Derived state for convenience
}

// Interface for actions returned by the hook
export interface ChatAppActions {
    findPartner: () => void;
    sendMessage: (event?: React.FormEvent<HTMLFormElement>) => void; // Allow direct call or form event
    setNewMessage: (message: string) => void;
    resetChat: (disconnectClient?: boolean) => void; // Expose reset if needed externally
    reconnect: () => void;
}

// Interface for the hook's return value
export interface UseChatAppResult {
    state: ChatAppState;
    actions: ChatAppActions;
}

// Interface for match data from backend
export interface MatchData {
    sessionId: string;
    partnerUsername: string;
}

// Interface for error data from backend
export interface ErrorData {
    error: string;
    message?: string;
    sessionId?: string; // For already_in_session
}