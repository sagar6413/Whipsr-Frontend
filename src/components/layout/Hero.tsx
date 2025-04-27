"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Send, Shield, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Refined animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smoother animation
    },
  }),
};

const bubbleIn = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.4,
      type: "spring",
      stiffness: 180,
      damping: 15,
    },
  }),
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

interface HeroSectionProps {
  messages: string[];
}

const Hero: FC<HeroSectionProps> = ({
  messages = [
    "Hey there! How does this ephemeral chat work?",
    "Messages disappear after they're read. No logs, no history, just privacy.",
    "That sounds perfect for sharing sensitive information!",
    "Exactly! We don't store anything on our servers.",
  ],
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  // Typing effect
  useEffect(() => {
    const textToType = "Type your message securely...";
    let typingTimeout: NodeJS.Timeout;

    if (typingIndex < textToType.length) {
      typingTimeout = setTimeout(() => {
        setTypingText(textToType.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
        setIsTyping(true);
      }, 80); // Slightly faster typing
    } else {
      setIsTyping(false);
      setTimeout(() => {
        setTypingIndex(0);
        setTypingText("");
      }, 3000);
    }

    return () => clearTimeout(typingTimeout);
  }, [typingIndex]);

  // Reset typing effect on mount
  useEffect(() => {
    setTypingIndex(0);
    setTypingText("");
    setIsTyping(false);

    // Show notification after a delay
    const notificationTimeout = setTimeout(() => {
      setShowNotification(true);

      // Auto-dismiss after 5 seconds
      const dismissTimeout = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(dismissTimeout);
    }, 3000);

    return () => clearTimeout(notificationTimeout);
  }, []);

  const handleStartChatting = () => {
    router.push("/chat");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-16 overflow-hidden">
      {/* Background blur elements with improved positioning and colors */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-[#6200EA]/15 rounded-full filter blur-[100px]"
          animate={{ x: [0, 25, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#00BFA5]/15 rounded-full filter blur-[100px]"
          animate={{ x: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-700/10 rounded-full filter blur-[80px] hidden md:block"
          animate={{ y: [0, 40, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative"
          initial="hidden"
          animate="visible"
        >
          {/* Left side content */}
          <motion.div className="space-y-8" variants={fadeIn} custom={0.1}>
            {/* Badge with refined design */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 shadow-sm"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Shield className="w-4 h-4 text-[#00BFA5]" />
              <span className="text-sm font-medium">Private & Ephemeral</span>
            </motion.div>

            {/* Heading with improved typography and animations */}
            <div>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.span
                  className="block"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.7 },
                    },
                  }}
                >
                  Messages that{" "}
                  <motion.span
                    className="text-teal-400 relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    disappear
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    />
                  </motion.span>
                </motion.span>

                <motion.span
                  className="block mt-2"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.7 },
                    },
                  }}
                >
                  Conversations that{" "}
                  <motion.span
                    className="text-purple-400 relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    sizzle
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                    />
                  </motion.span>
                </motion.span>
              </motion.h1>
            </div>

            {/* Description with improved readability */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg"
              variants={fadeIn}
              custom={0.4}
            >
              Whispr offers temporary, private text conversations that leave no
              trace. Perfect for sharing sensitive information securely.
            </motion.p>

            {/* CTA button with enhanced animation */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              variants={fadeIn}
              custom={0.6}
            >
              <motion.button
                className="relative overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold transition-all rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/30 active:scale-95 group text-lg px-8 py-4"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartChatting}
              >
                <span className="relative z-10 flex items-center justify-center font-medium">
                  Start Chatting
                  <motion.span
                    className="ml-2 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      repeatDelay: 1,
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#00BFA5] to-[#6200EA] opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Features list with enhanced animations */}
            <motion.div
              className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-400 mt-6"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.8 },
                },
              }}
            >
              <motion.div
                className="flex items-center space-x-2"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.9)" }}
              >
                <Lock className="w-4 h-4 text-[#00BFA5]" />
                <span>End-to-end privacy</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.9)" }}
              >
                <Shield className="w-4 h-4 text-[#00BFA5]" />
                <span>No message history</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.9)" }}
              >
                <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
                <span>No tracking or data collection</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Chat demo visualization - Enhanced */}
          <motion.div
            className="relative mx-auto lg:ml-auto max-w-md w-full"
            variants={fadeIn}
            custom={0.3}
            animate={{ ...floatingAnimation, ...fadeIn.visible(0.3) }}
            initial="hidden"
          >
            {/* Notification toast */}
            {showNotification && (
              <motion.div
                className="absolute top-0 right-0 transform -translate-y-16 z-20 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-3 pr-10 shadow-lg w-full max-w-xs"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#00BFA5]" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-white">
                      End-to-end encrypted
                    </p>
                    <p className="mt-1 text-xs text-gray-300">
                      Your messages are protected and will disappear after
                      reading
                    </p>
                  </div>
                  <button
                    className="ml-4 text-gray-400 hover:text-white"
                    onClick={() => setShowNotification(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Improved glow effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-b from-[#6200EA]/20 to-[#00BFA5]/20 rounded-3xl filter blur-xl -z-10"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />

            {/* Chat container with enhanced design */}
            <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Chat header */}
              <motion.div
                className="h-14 bg-gradient-to-r from-[#6200EA]/90 to-[#00BFA5]/90 flex items-center px-4 rounded-xl mb-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/20 mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-white/60 rounded-full"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
                <div>
                  <div className="text-white font-medium">Anonymous</div>
                  <div className="text-white/70 text-xs flex items-center">
                    <motion.span
                      className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <span>Secure connection</span>
                  </div>
                </div>
              </motion.div>

              {/* Messages with enhanced styling */}
              <motion.div
                className="flex flex-col space-y-4 overflow-y-auto pr-2 mb-4"
                style={{ height: "280px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.4, delayChildren: 0.8 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`max-w-[75%] p-3.5 rounded-2xl ${
                      index % 2 === 0
                        ? "self-start bg-[#252525] rounded-bl-none" // Received
                        : "self-end bg-gradient-to-r from-[#6200EA]/90 to-[#00BFA5]/90 rounded-br-none" // Sent
                    }`}
                    variants={bubbleIn}
                  >
                    <p
                      className={`text-sm ${
                        index % 2 === 0 ? "text-gray-200" : "text-white"
                      }`}
                    >
                      {msg}
                    </p>
                    <div
                      className={`text-[10px] mt-1 ${
                        index % 2 === 0
                          ? "text-gray-400 text-right"
                          : "text-white/70 text-right"
                      }`}
                    >
                      {new Date().getHours()}:
                      {String(new Date().getMinutes()).padStart(2, "0")}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Input area with improved styling */}
              <motion.div
                className="mt-4 bg-[#252525] rounded-xl border border-white/10 p-2.5 flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.6 }}
              >
                <div className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white/70 placeholder-gray-500 px-2.5 h-10 flex items-center">
                  {/* Typing indicator */}
                  {typingText ? (
                    <div className="flex items-center">
                      <span>{typingText}</span>
                      {isTyping && (
                        <motion.span
                          className="inline-block w-1 h-4 bg-white/70 ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">Type a message...</span>
                  )}
                </div>

                <motion.button
                  className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] hover:opacity-90 text-white h-10 w-10 p-0 rounded-lg flex-shrink-0 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>

            {/* Enhanced subtle glows */}
            <motion.div
              className="absolute -top-4 -left-4 w-28 h-28 rounded-full bg-[#6200EA]/10 blur-xl -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-[#00BFA5]/10 blur-xl -z-10"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
