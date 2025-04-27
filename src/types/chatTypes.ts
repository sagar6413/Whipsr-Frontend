// src/chatTypes.ts

export enum ChatState {
    IDLE = 'IDLE',
    SEARCHING = 'SEARCHING', // Searching for random partner
    CREATING_INVITE = 'CREATING_INVITE', // Waiting for invite code from backend
    WAITING_WITH_INVITE = 'WAITING_WITH_INVITE', // User created an invite and is waiting
    JOINING_INVITE = 'JOINING_INVITE', // User submitted an invite code and is waiting for pairing
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
    MATCH = 'MATCH',
    ERROR = 'ERROR',
    INVITE_CODE = 'INVITE_CODE',
    SESSION_ENDED = 'SESSION_ENDED' // Custom type for displaying generated invite code
}

// Interface for messages coming from the backend or generated locally
export interface ChatMessageData {
    type: MessageType;
    content: string;
    senderUsername?: string; // Optional as backend might omit for system messages
    timestamp?: string; // Optional as we might add it locally
    inviteCode?: string; // For INVITE_CODE type message
    expiresInSeconds?: number; // For INVITE_CODE type message
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
    myInviteCode: string | null; // Store the invite code generated for the current user
    inviteCodeExpiresIn: number | null; // Store TTL for display
}

// Interface for actions returned by the hook
export interface ChatAppActions {
    findPartner: () => void;
    createInvite: () => void; // New action
    joinWithInvite: (inviteCode: string) => void; // New action
    sendMessage: (event?: React.FormEvent<HTMLFormElement>) => void;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    resetChat: (disconnectClient?: boolean) => void;
    reconnect: () => void;
    cancelInvite?: () => void; // Optional: Action to cancel a created invite
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
    sessionId?: string;
}

// --- New Interfaces for Invite Feature ---

// Interface for payload sent back to creator with the code
export interface InviteCodeResponseData {
    inviteCode: string;
    expiresInSeconds: number;
}

// Interface for payload sent by client joining with code
// (This isn't strictly needed for hook state, but good for reference)
// export interface JoinInvitePayloadData {
//     inviteCode: string;
// }