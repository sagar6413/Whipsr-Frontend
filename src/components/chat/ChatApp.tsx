"use client";

import React, { useEffect, useRef, JSX, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatApp } from "@/hooks/useChatApp";
import { ChatMessageData, ChatState, MessageType } from "@/types/chatTypes";

export default function ChatApp() {
  const { tokens } = useAuth();
  const authToken = tokens?.accessToken || null;
  const { user } = useAuth();

  // State for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { state, actions } = useChatApp(authToken);
  const {
    chatState,
    messages,
    newMessage,
    sessionId,
    partnerUsername,
    error,
    isConnected,
  } = state;
  const { findPartner, sendMessage, setNewMessage, resetChat, reconnect } =
    actions;

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Ref for Auto-Scrolling
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Message Renderer
  const renderMessage = (msg: ChatMessageData, index: number): JSX.Element => {
    const sender = msg.senderUsername || "System";
    const time = msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Determine if message is from current user
    const isMe = user?.username === msg.senderUsername;

    switch (msg.type) {
      case MessageType.JOIN:
      case MessageType.LEAVE:
      case MessageType.SYSTEM:
      case MessageType.MATCH:
      case MessageType.ERROR:
        return (
          <div
            key={`${msg.type}-${index}-${msg.timestamp}`}
            className="py-2 px-3 my-2 text-sm text-gray-500 italic bg-gray-50 rounded-md w-full"
          >
            <span className="font-medium">{sender}</span>
            {time && <span className="ml-1 text-xs text-gray-400">{time}</span>}
            <span className="ml-2">{msg.content}</span>
          </div>
        );
      case MessageType.CHAT:
      default:
        return (
          <div
            key={`${msg.type}-${index}-${msg.timestamp}`}
            className={`max-w-xs md:max-w-md py-2 px-4 my-1 rounded-2xl shadow-sm ${
              isMe
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-baseline gap-2 mb-1">
              <span
                className={`font-medium text-sm ${
                  isMe ? "text-blue-100" : "text-blue-600"
                }`}
              >
                {sender}
              </span>
              <span
                className={`text-xs ${
                  isMe ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {time}
              </span>
            </div>
            <div>{msg.content}</div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] max-h-screen max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Incognito Chat</h2>
          <div className="flex items-center">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } mr-2`}
            ></span>
            <span className="text-sm text-gray-600 font-medium">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-medium">Status:</span> {chatState}
            {partnerUsername && chatState === ChatState.IN_CHAT && (
              <span className="ml-1">
                with <span className="font-medium">{partnerUsername}</span>
              </span>
            )}
            {sessionId && chatState === ChatState.IN_CHAT && (
              <span className="ml-1 text-gray-400 text-xs">
                Session: {sessionId.substring(0, 8)}...
              </span>
            )}
          </div>

          {/* Chat Control Buttons */}
          {chatState === ChatState.IN_CHAT && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetChat();
                  findPartner();
                }}
                className="text-xs py-1 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
              >
                New Partner
              </button>
              <button
                onClick={() => resetChat()}
                className="text-xs py-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                Exit Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col p-4 overflow-hidden">
        {/* Connecting State */}
        {chatState === ChatState.CONNECTING && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="animate-pulse mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-400"></div>
            </div>
            <p className="text-gray-500">Connecting to chat service...</p>
          </div>
        )}

        {/* Reconnect Button - Show if NOT connected AND NOT currently trying to connect */}
        {!isConnected && chatState !== ChatState.CONNECTING && (
          <div>
            <p>{error ? "Connection failed." : "Disconnected."}</p>
            <button onClick={reconnect}>Reconnect</button>
          </div>
        )}

        {/* Disconnected/Error State */}
        {(chatState === ChatState.DISCONNECTED ||
          (chatState === ChatState.ERROR && !isConnected)) && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="rounded-full bg-gray-200 p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              {error ? "Connection failed." : "Disconnected."} Please refresh or
              check your connection.
            </p>
          </div>
        )}

        {/* Idle State */}
        {chatState === ChatState.IDLE && isConnected && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <button
              onClick={findPartner}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg active:translate-y-0.5"
            >
              Find Partner
            </button>
          </div>
        )}

        {/* Searching State */}
        {chatState === ChatState.SEARCHING && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-500"></div>
            </div>
            <p className="text-gray-500">Searching for a chat partner...</p>
          </div>
        )}

        {/* Chat Area */}
        {(chatState === ChatState.SEARCHING ||
          chatState === ChatState.IN_CHAT) && (
          <div
            ref={chatMessagesRef}
            className="flex-grow overflow-y-auto p-4 space-y-2"
          >
            {messages.length === 0 && chatState === ChatState.IN_CHAT && (
              <p className="text-center text-gray-400 italic py-4">
                Chat started. Say hello!
              </p>
            )}
            {messages.map(renderMessage)}
          </div>
        )}
      </div>

      {/* Message Input */}
      {chatState === ChatState.IN_CHAT && (
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex items-center relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2 py-3 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isConnected}
            />

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-14 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl" role="img" aria-label="emoji">
                😊
              </span>
            </button>

            <button
              type="submit"
              className={`rounded-full p-3 focus:outline-none ${
                !isConnected || !newMessage.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
              disabled={!isConnected || !newMessage.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                <div className="grid grid-cols-8 gap-1">
                  {[
                    "😊",
                    "😂",
                    "🥰",
                    "😍",
                    "👍",
                    "🎉",
                    "🔥",
                    "❤️",
                    "👏",
                    "🙏",
                    "😎",
                    "🤔",
                    "😢",
                    "😭",
                    "😡",
                    "🥺",
                    "🤗",
                    "🤣",
                    "😄",
                    "😁",
                    "😆",
                    "😉",
                    "😋",
                    "😘",
                    "🤩",
                    "😴",
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-gray-100 rounded p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-center mt-2 text-gray-500">
                  Common Emojis
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
