"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChatApp } from "@/hooks/useChatApp";
import { ChatMessageData, ChatState, MessageType } from "@/types/chatTypes";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Copy,
  LinkIcon,
  Loader2,
  LogIn,
  MessageSquareHeart,
  MessageSquarePlus,
  SendHorizontal,
  Share2,
  Smile,
  WifiOff,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getAccessToken, isAuthenticated } from "@/utils/cookieManager";

// Define constant outside component if used in multiple places
const INVITE_CODE_LENGTH = 6;

// --- Animation Variants ---

// General container fade-in
const containerFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

// Staggered fade-in for lists/children

// Individual item fade-in (used within stagger)
const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }, // Cubic ease-out
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Chat bubble animation
const chatBubbleVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 25,
      // Add a slight delay based on index if desired, but often better without for chat
      // delay: i * 0.05 // Example: if you pass 'i' custom prop
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// System message animation
const systemMessageVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// --- Component ---

export default function ChatApp() {
  console.log(
    "INSIDE CHAT PAGE..INSIDE CHAT PAGE..INSIDE CHAT PAGE..INSIDE CHAT PAGE..INSIDE CHAT PAGE.."
  );

  const { user } = useUserStore();

  const router = useRouter();
  const authToken = getAccessToken() || null;
  const { state, actions } = useChatApp(authToken);

  const {
    chatState,
    messages,
    newMessage,
    partnerUsername,
    error,
    isConnected,
    myInviteCode,
    inviteCodeExpiresIn,
  } = state;
  const {
    findPartner,
    createInvite,
    joinWithInvite,
    sendMessage,
    setNewMessage,
    resetChat,
    reconnect,
  } = actions;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState(""); // State for join code input
  const [copied, setCopied] = useState(false);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input focus

  // Scroll to bottom effect
  useEffect(() => {
    if (chatMessagesRef.current) {
      // Smooth scroll behavior
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const navigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (authToken === null) {
      navigateToLogin();
    }
  }, [authToken, navigateToLogin]);

  // Focus input when chat starts
  useEffect(() => {
    if (chatState === ChatState.IN_CHAT && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatState]);

  useEffect(() => {
    console.log("Hahahahha", isAuthenticated());
  }, []);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      // Check if the click is outside the emoji picker and its button
      // This requires adding refs or specific IDs/classes to the picker and button if needed
      // For simplicity, we'll just close it if it's open on any click for now.
      // A more robust solution would check event.target.closest('.emoji-picker-container') etc.
      if (showEmojiPicker) {
        // Simple implementation: close if click is anywhere
        // A better way: add refs to picker and button, check if click is outside both
        // setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage();
    setShowEmojiPicker(false);
  };

  const handleCreateInvite = () => {
    if (chatState === ChatState.IDLE && isConnected) {
      createInvite();
    }
  };

  const handleJoinWithInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatState === ChatState.IDLE && isConnected && inviteCodeInput.trim()) {
      joinWithInvite(inviteCodeInput.trim());
      setInviteCodeInput("");
    }
  };

  const handleCopyInviteCode = () => {
    if (myInviteCode) {
      navigator.clipboard
        .writeText(myInviteCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
        })
        .catch((err) => {
          console.error("Failed to copy invite code:", err);
          // Optionally show an error message to the user
        });
    }
  };

  // --- Message Renderer ---
  const renderMessage = (msg: ChatMessageData, index: number) => {
    const sender = msg.senderUsername || "System";
    const time = msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const isMe = user?.username === msg.senderUsername;

    switch (msg.type) {
      case MessageType.JOIN:
      case MessageType.LEAVE:
      case MessageType.SYSTEM:
      case MessageType.MATCH:
      case MessageType.ERROR:
      case MessageType.INVITE_CODE:
      case MessageType.TYPING:
        return (
          <motion.div
            key={`${msg.type}-${index}-${msg.timestamp}`}
            className="text-center my-3 px-4"
            variants={systemMessageVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <span
              className={`text-xs ${
                msg.type === MessageType.ERROR
                  ? "text-red-300 bg-red-900/30 border-red-500/50"
                  : "text-gray-400 bg-[#2D2D2D] border-white/10"
              } px-3 py-1 rounded-full border shadow-sm`}
            >
              {msg.type === MessageType.INVITE_CODE && (
                <LinkIcon size={10} className="inline mr-1 mb-0.5" />
              )}
              {sender !== "System" && (
                <span className="font-medium text-[#00BFA5] mr-1">
                  {sender}:
                </span>
              )}
              {msg.content}
              {time && <span className="ml-1.5 text-gray-500">{time}</span>}
            </span>
          </motion.div>
        );

      case MessageType.CHAT:
      default:
        return (
          <motion.div
            key={`${msg.type}-${index}-${msg.timestamp}`}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            variants={chatBubbleVariant}
            initial="hidden"
            animate="visible"
            exit="exit" // Needs AnimatePresence wrapper
            layout // Animates layout changes smoothly
          >
            <div
              className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 my-1 rounded-t-xl shadow-md relative ${
                isMe
                  ? "bg-gradient-to-br from-[#6200EA]/95 to-[#00BFA5]/95 rounded-bl-xl" // User bubble
                  : "bg-[#2D2D2D] border border-white/10 rounded-br-xl" // Partner bubble
              }`}
            >
              {/* Optional: Display sender name for partner messages if needed */}
              {/* {!isMe && (
                <span className="block font-medium text-xs text-[#00BFA5] mb-1">
                  {sender}
                </span>
              )} */}
              <p className={`text-sm ${isMe ? "text-white" : "text-gray-100"}`}>
                {msg.content}
              </p>
            </div>
            <span
              className={`text-[10px] mt-0.5 px-2 ${
                isMe ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {time}
            </span>
          </motion.div>
        );
    }
  };

  // --- Idle State Actions (Find, Create Invite, Join Invite) ---
  const renderIdleActions = () => (
    <motion.div
      className="w-full flex-grow flex flex-col md:flex-row items-center md:justify-center gap-6 p-6 md:p-8 bg-gradient-to-b from-[#191919] to-[#121212] overflow-y-scroll"
      variants={itemFadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Option 1: Find Random Partner */}
      <div className="w-full max-w-sm p-5 bg-[#2a2a2a]/50 border border-white/10 rounded-lg shadow-md">
        <MessageSquarePlus className="w-8 h-8 text-[#00BFA5] mx-auto mb-3" />
        <p className="text-lg font-semibold text-white mb-2">Find a Partner</p>
        <p className="text-sm text-gray-400 mb-4">
          Jump into a random chat session.
        </p>
        <motion.button
          onClick={findPartner}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-[#6200EA]/30 hover:shadow-xl hover:from-[#6d1ff4] hover:to-[#03dac5] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          disabled={!isConnected}
        >
          <ArrowRight className="w-5 h-5" />
          Search Now
        </motion.button>
      </div>

      {/* Option 2: Create Invite */}
      <div className="w-full max-w-sm p-5 bg-[#2a2a2a]/50 border border-white/10 rounded-lg shadow-md">
        <Share2 className="w-8 h-8 text-[#a580ff] mx-auto mb-3" />
        <p className="text-lg font-semibold text-white mb-2">Create Invite</p>
        <p className="text-sm text-gray-400 mb-4">
          Generate a code to share with a friend.
        </p>
        <motion.button
          onClick={handleCreateInvite}
          className="w-full  flex items-center justify-center gap-2 bg-gradient-to-r from-[#8A2BE2] to-[#6200EA] text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-[#8A2BE2]/30 hover:shadow-xl hover:from-[#9932CC] hover:to-[#6d1ff4] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          disabled={!isConnected}
        >
          <LinkIcon className="w-5 h-5" />
          Generate Code
        </motion.button>
      </div>

      {/* Option 3: Join With Invite Code */}
      <div className="w-full max-w-sm p-5 bg-[#2a2a2a]/50 border border-white/10 rounded-lg shadow-md">
        <LogIn className="w-8 h-8 text-[#00e0c3] mx-auto mb-3" />
        <p className="text-lg font-semibold text-white mb-2">Join with Code</p>
        <form onSubmit={handleJoinWithInvite} className="space-y-3">
          <input
            type="text"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())} // Uppercase input
            placeholder="Enter Invite Code"
            maxLength={INVITE_CODE_LENGTH} // Use constant if defined
            className="w-full h-10 px-4 rounded-full bg-[#1E1E1E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#00BFA5]/50 focus:border-[#00BFA5] text-white placeholder-gray-500 text-sm text-center tracking-widest font-mono disabled:opacity-50"
            disabled={!isConnected}
            required
            autoCapitalize="characters"
            autoComplete="off"
          />
          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00BFA5] to-[#00796B] text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-[#00BFA5]/30 hover:shadow-xl hover:from-[#03dac5] hover:to-[#00897B] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isConnected || !inviteCodeInput.trim()}
          >
            <LogIn className="w-5 h-5" />
            Join Chat
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  // --- Display Invite Code State ---
  const renderWaitingWithInvite = () => (
    <motion.div
      className="flex-grow flex flex-col items-center justify-center text-center p-8"
      variants={itemFadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <LinkIcon className="w-12 h-12 text-[#a580ff] mb-4" />
      <p className="text-lg font-medium text-gray-300 mb-2">
        Invite Code Generated
      </p>
      <p className="text-sm text-gray-400 mb-4">
        Share this code with your friend:
      </p>
      <div className="flex items-center gap-2 bg-[#2D2D2D] border border-white/10 rounded-lg p-3 mb-4 shadow-inner">
        <span className="text-2xl font-mono tracking-widest text-white">
          {myInviteCode}
        </span>
        <motion.button
          title="Copy Code"
          onClick={handleCopyInviteCode}
          className={`p-1.5 rounded-md transition-colors duration-150 ${
            copied
              ? "bg-green-600 text-white"
              : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Copy size={16} />
        </motion.button>
      </div>
      {inviteCodeExpiresIn !== null && (
        <p className="text-xs text-gray-500 mb-6">
          (Expires in ~{Math.round(inviteCodeExpiresIn / 60)} minutes)
          {/* TODO: Implement a countdown timer here */}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-6">
        Waiting for someone to join...
      </p>
      {/* Optional Cancel Button */}
      <motion.button
        onClick={() => resetChat(false)} // Reset to IDLE, keeps connection
        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Cancel Invite
      </motion.button>
    </motion.div>
  );

  // --- State Specific Content ---
  const renderStateContent = () => {
    switch (chatState) {
      case ChatState.CONNECTING: // Connecting spinner
      case ChatState.SEARCHING: // Searching spinner
      case ChatState.CREATING_INVITE: // Invite generation spinner
      case ChatState.JOINING_INVITE:
        const messages: Record<ChatState, { title: string; subtitle: string }> =
          {
            [ChatState.CONNECTING]: {
              title: "Connecting",
              subtitle: "Establishing secure connection...",
            },
            [ChatState.SEARCHING]: {
              title: "Searching...",
              subtitle: "Looking for a random partner.",
            },
            [ChatState.CREATING_INVITE]: {
              title: "Generating Code...",
              subtitle: "Creating your unique invite.",
            },
            [ChatState.JOINING_INVITE]: {
              title: "Joining Chat...",
              subtitle: "Connecting with the invite code.",
            },
            // Add other states if needed
            [ChatState.IDLE]: { title: "", subtitle: "" }, // Placeholder
            [ChatState.WAITING_WITH_INVITE]: { title: "", subtitle: "" }, // Placeholder
            [ChatState.IN_CHAT]: { title: "", subtitle: "" }, // Placeholder
            [ChatState.DISCONNECTED]: { title: "", subtitle: "" }, // Placeholder
            [ChatState.ERROR]: { title: "", subtitle: "" }, // Placeholder
          };
        const currentMsg = messages[chatState]; // Joining invite spinner
        return (
          <motion.div
            className="flex-grow flex flex-col items-center justify-center text-center p-8"
            variants={itemFadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Loader2 className="w-12 h-12 text-[#00BFA5] animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-300">
              {currentMsg.title}
            </p>
            <p className="text-sm text-gray-400">{currentMsg.subtitle}</p>
          </motion.div>
        );

      case ChatState.IDLE:
        return isConnected
          ? renderIdleActions()
          : renderReconnect("Ready to connect?");

      case ChatState.WAITING_WITH_INVITE:
        return renderWaitingWithInvite();

      case ChatState.IN_CHAT:
        return null;

      case ChatState.SEARCHING:
        return (
          <motion.div
            className="flex-grow flex flex-col items-center justify-center text-center p-8"
            variants={itemFadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="w-16 h-16 border-4 border-[#00BFA5] border-dashed rounded-full animate-spin mb-6"
              style={{
                borderTopColor: "transparent",
                borderLeftColor: "transparent",
              }}
              transition={{ loop: Infinity, ease: "linear", duration: 1.5 }}
            ></motion.div>
            <p className="text-lg font-medium text-gray-300">Searching...</p>
            <p className="text-sm text-gray-400">
              Looking for the perfect match.
            </p>
            {/* Optional: Add a cancel search button */}
            {/* <motion.button onClick={resetChat} className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</motion.button> */}
          </motion.div>
        );

      case ChatState.DISCONNECTED:
      case ChatState.ERROR:
        // If not connected show reconnect, otherwise show error message
        if (!isConnected) {
          return renderReconnect(error ? "Connection Failed" : "Disconnected");
        } else {
          // This case might occur if there's an error but the socket *thinks* it's connected
          return (
            <motion.div
              className="flex-grow flex flex-col items-center justify-center text-center p-8"
              variants={itemFadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 bg-red-900/30 rounded-full mb-6 border border-red-500/50">
                <WifiOff className="w-10 h-10 text-red-400" />
              </div>
              <p className="text-xl font-semibold text-red-300 mb-2">
                Connection Error
              </p>
              <p className="text-gray-400 mb-6">
                {error || "An unexpected error occurred."}
              </p>
              {/* Optionally add a button to try finding partner again or reset */}
              <motion.button
                onClick={() => resetChat} // Or maybe reconnect action if appropriate
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-full shadow-md transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Back
              </motion.button>
            </motion.div>
          );
        }

      default:
        return (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Unknown state
          </div>
        );
    }
  };

  // Reusable Reconnect Button Component/Function
  const renderReconnect = (message: string) => (
    <motion.div
      className="flex-grow flex flex-col items-center justify-center text-center p-8"
      variants={itemFadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="p-4 bg-red-900/30 rounded-full mb-6 border border-red-500/50">
        <WifiOff className="w-10 h-10 text-red-400" />
      </div>
      <p className="text-xl font-semibold text-red-300 mb-2">{message}</p>
      <p className="text-gray-400 mb-6">
        Please check your connection or try again.
      </p>
      <motion.button
        onClick={reconnect}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-[#6200EA]/30 hover:shadow-xl hover:from-[#6d1ff4] hover:to-[#03dac5] transition-all duration-300 ease-out"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        Reconnect
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      className="relative flex flex-col h-screen bg-[#121212]/90 backdrop-blur-lg shadow-2xl shadow-black/40"
      variants={containerFadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#6200EA]/15 rounded-full filter blur-3xl opacity-50"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-5 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-[#00BFA5]/15 rounded-full filter blur-3xl opacity-60"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Add subtle sparkle elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.9, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex-shrink-0 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left Side: Logo & Title with enhanced animation */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
                className="relative"
              >
                {/* Glow effect behind icon */}
                <div className="absolute -inset-1 bg-[#6200EA]/30 rounded-full blur-md" />
                <MessageSquareHeart className="w-8 h-8 text-[#6200EA] drop-shadow-[0_0_8px_rgba(98,0,234,0.5)] relative z-10" />
              </motion.div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#6200EA] via-[#9d4edd] to-[#00BFA5] bg-clip-text text-transparent drop-shadow-sm">
                  Whispr
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Right Side: Partner Info & Controls with enhanced styling */}
          <AnimatePresence>
            {chatState === ChatState.IN_CHAT && partnerUsername && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3">
                  {/* Online indicator */}
                  <div className="relative flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]"></div>
                    <span className="text-sm font-medium text-white">
                      {partnerUsername}
                    </span>
                  </div>

                  {/* Exit Chat Button - Enhanced with better hover effects */}
                  <motion.button
                    title="Exit Chat"
                    onClick={() => {
                      resetChat();
                      reconnect();
                    }}
                    className="relative p-2 rounded-full group overflow-hidden"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92, rotate: -15 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-red-700/30 rounded-full opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />

                    {/* Subtle glow effect on hover */}
                    <div className="absolute -inset-1 bg-red-500/0 group-hover:bg-red-500/20 rounded-full blur-md transition-all duration-300" />

                    {/* Button border with animation */}
                    <div className="absolute inset-0 rounded-full border border-red-500/40 group-hover:border-red-500/80 transition-colors duration-300" />

                    {/* Icon with enhanced visibility */}
                    <div className="relative flex items-center justify-center text-red-400 group-hover:text-red-300 transition-colors duration-300">
                      <X
                        size={18}
                        strokeWidth={2.5}
                        className="drop-shadow-lg"
                      />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Display Area */}
      <AnimatePresence>
        {error &&
          ![ChatState.ERROR, ChatState.DISCONNECTED].includes(chatState) && (
            <motion.div
              className="mx-6 mt-4 p-3 bg-red-900/40 border border-red-600/50 text-red-200 rounded-lg text-sm flex items-center gap-2 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="p-1 bg-red-500/20 rounded-full">
                <X size={16} className="text-red-400" />
              </div>
              <span>{error}</span>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Main Content Area (Chat Messages or State Content) */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        {/* Chat Messages Area */}
        <div
          ref={chatMessagesRef}
          className="flex-grow overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-[#4A4A4A] scrollbar-track-transparent"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence initial={false}>
            {messages.map(renderMessage)}
          </AnimatePresence>

          {/* Placeholder/Empty State for IN_CHAT */}
          {messages.length === 0 && chatState === ChatState.IN_CHAT && (
            <motion.div
              className="flex flex-col items-center justify-center h-full gap-4 py-12"
              variants={itemFadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6200EA]/20 to-[#00BFA5]/20 flex items-center justify-center">
                <MessageSquareHeart className="w-8 h-8 text-[#9d4edd]/70" />
              </div>
              <p className="text-center text-gray-400 max-w-sm">
                You are connected with{" "}
                <span className="font-medium text-[#00BFA5]">
                  {partnerUsername}
                </span>
                . Send a message to start the conversation.
              </p>
            </motion.div>
          )}
        </div>

        {/* Overlay for other states */}
        <AnimatePresence mode="wait">
          {chatState !== ChatState.IN_CHAT && (
            <motion.div
              key={chatState}
              className="absolute inset-0 bg-[#121212]/95 backdrop-blur-md flex flex-col z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStateContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input Area */}
      <AnimatePresence>
        {chatState === ChatState.IN_CHAT && (
          <motion.div
            className="flex-shrink-0 p-4 bg-black/60 backdrop-blur-lg border-t border-white/10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Emoji Picker with enhanced styling */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  className="absolute bottom-full right-4 mb-3 bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-4 z-20 w-80"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <div className="px-2 py-1 mb-2 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-400">
                      Quick reactions
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-2 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
                    {[
                      "😊",
                      "😂",
                      "😍",
                      "👍",
                      "🎉",
                      "🔥",
                      "❤️",
                      "🙏",
                      "🤔",
                      "😢",
                      "😭",
                      "😡",
                      "🥺",
                      "👀",
                      "✨",
                      "🚀",
                      "👋",
                      "💯",
                      "✅",
                      "💡",
                      "💀",
                      "🤣",
                      "🥳",
                      "🤯",
                    ].map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl hover:bg-white/10 rounded-lg p-2 aspect-square flex items-center justify-center"
                        whileHover={{
                          scale: 1.15,
                          rotate: 5,
                          backgroundColor: "rgba(255,255,255,0.1)",
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 max-w-4xl mx-auto"
            >
              {/* Emoji Toggle Button with enhanced styles */}
              <motion.button
                type="button"
                title="Add Emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`relative flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  showEmojiPicker
                    ? "bg-gradient-to-br from-[#00BFA5]/20 to-[#00BFA5]/40 text-[#00BFA5]"
                    : "bg-white/5 text-gray-400 hover:text-[#00BFA5] hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                disabled={!isConnected}
              >
                {/* Subtle glow on active state */}
                {showEmojiPicker && (
                  <div className="absolute inset-0 bg-[#00BFA5]/20 rounded-full blur-md -z-10"></div>
                )}
                <Smile className="w-5 h-5" />
              </motion.button>

              {/* Text Input with enhanced styling */}
              <div className="relative flex-grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    isConnected
                      ? "Type a message..."
                      : "Waiting for connection..."
                  }
                  className="w-full h-12 px-6 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 focus:border-[#00BFA5]/60 text-white placeholder-gray-500 text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-inner"
                  disabled={!isConnected}
                  autoComplete="off"
                />

                {/* Connection indicator with pulsing animation */}
                {isConnected ? (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(74,222,128,0.4)",
                        "0 0 0 4px rgba(74,222,128,0)",
                        "0 0 0 0 rgba(74,222,128,0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400" />
                )}
              </div>

              {/* Send Button with enhanced gradient and effects */}
              <motion.button
                type="submit"
                title="Send Message"
                className={`relative flex-shrink-0 rounded-full h-12 w-12 flex items-center justify-center focus:outline-none transition-all duration-300 ease-out overflow-hidden
              ${
                !isConnected || !newMessage.trim()
                  ? "bg-gray-800/80 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-br from-[#6200EA] to-[#00BFA5] hover:from-[#6e2bf5] hover:to-[#03dac5] text-white shadow-md hover:shadow-lg"
              }`}
                disabled={!isConnected || !newMessage.trim()}
                whileHover={
                  isConnected && newMessage.trim() ? { scale: 1.08, y: -1 } : {}
                }
                whileTap={
                  isConnected && newMessage.trim() ? { scale: 0.92 } : {}
                }
              >
                {/* Add subtle glow effect when active */}
                {isConnected && newMessage.trim() && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6200EA]/30 to-[#00BFA5]/30 blur-md"></div>
                )}

                <SendHorizontal
                  className={`h-5 w-5 ${
                    isConnected && newMessage.trim()
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
