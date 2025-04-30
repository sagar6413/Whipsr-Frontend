"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, ShieldCheck } from "lucide-react";
import { setTokens } from "@/utils/cookieManager";

// Define animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

// Simple Spinner with animation
const Spinner = () => (
  <motion.div
    className="border-white/30 h-10 w-10 rounded-full border-4 border-t-[#00BFA5] border-r-[#6200EA]"
    animate={{ rotate: 360 }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Status is simpler now: just processing or error
type Status = "processing" | "error";

const OAuthRedirectContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Store initial values in refs
  const initialSearchParams = useRef(searchParams);
  const initialRouter = useRef(router);

  useEffect(() => {
    console.log("useEffect triggered");

    const token = initialSearchParams.current.get("token");
    const error = initialSearchParams.current.get("error");
    const refreshToken = initialSearchParams.current.get("refreshToken");

    console.log("Token:", token);
    console.log("Error:", error);
    console.log("Refresh Token:", refreshToken);

    if (error) {
      console.log("Authentication error detected");
      setErrorMessage(error || "An error occurred during authentication.");
      setStatus("error");
    } else if (token && refreshToken) {
      console.log(
        "Authentication successful. Storing tokens and redirecting..."
      );
      setTokens(token, refreshToken);
      initialRouter.current.push("/chat");
    } else {
      console.log("Invalid authentication response from server");
      setErrorMessage("Invalid authentication response from server.");
      setStatus("error");
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements - same as hero */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-[#6200EA]/20 rounded-full filter blur-3xl"
          animate={{ x: [0, 30, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#00BFA5]/20 rounded-full filter blur-3xl"
          animate={{ x: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-700/10 rounded-full filter blur-3xl hidden md:block"
          animate={{ y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="flex justify-center"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative max-w-md w-full"
            variants={fadeIn}
            custom={0.1}
            animate={{ ...floatingAnimation, ...fadeIn.visible(0.1) }}
            initial="hidden"
          >
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-b from-[#6200EA]/20 to-[#00BFA5]/20 rounded-3xl filter blur-xl -z-10"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />

            <div className="relative bg-[#1E1E1E] rounded-2xl border border-white/10 p-8 shadow-xl overflow-hidden">
              {/* Card header with gradient */}
              <motion.div
                className="h-14 bg-gradient-to-r from-[#6200EA]/80 to-[#00BFA5]/80 flex items-center justify-center px-4 rounded-t-lg mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/20 mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Lock className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <div className="text-white font-medium">Authentication</div>
                    <div className="text-white/60 text-xs flex items-center">
                      <motion.span
                        className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"
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
                      Processing
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card content */}
              <motion.div
                className="flex flex-col items-center space-y-8 text-center"
                variants={fadeIn}
                custom={0.3}
              >
                {status === "processing" && (
                  <motion.div
                    className="flex flex-col items-center space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Spinner />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">
                        Authenticating
                      </h3>
                      <p className="text-gray-300">
                        Please wait while we process your authentication...
                      </p>
                    </div>

                    {/* Feature indicators at bottom */}
                    <motion.div
                      className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm text-gray-400 mt-6"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.8,
                          },
                        },
                      }}
                    >
                      <motion.div
                        className="flex items-center space-x-2"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5 },
                          },
                        }}
                      >
                        <Shield className="w-4 h-4 text-[#00BFA5]" />
                        <span>Secure connection</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-2"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5 },
                          },
                        }}
                      >
                        <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
                        <span>End-to-end encrypted</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg
                        className="h-10 w-10 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">
                        Authentication Failed
                      </h3>
                      <p className="text-red-400">
                        {errorMessage || "An unknown error occurred."}
                      </p>
                    </div>

                    <Link href="/login">
                      <motion.button
                        className="relative overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold transition-all rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/20 active:scale-95 group text-base px-6 py-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Return to Login
                          <motion.span
                            className="ml-2 flex items-center"
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              repeatDelay: 2,
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
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Background glows */}
            <motion.div
              className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#6200EA]/10 blur-xl -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#00BFA5]/10 blur-xl -z-10"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
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

// Wrap the component with Suspense for useSearchParams
const OAuthRedirectPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
          <Spinner />
        </div>
      }
    >
      <OAuthRedirectContent />
    </Suspense>
  );
};

export default OAuthRedirectPage;
