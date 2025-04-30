"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Shield,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Define verification status types
type VerificationStatus = "verifying" | "success" | "error" | "idle";

// Animation variants - same as login page
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// A spinner component styled to match the theme
const Spinner = () => (
  <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-[#00BFA5] animate-spin" />
);

// Inner component that uses useSearchParams
const EmailVerificationContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const verificationInitiatedRef = useRef(false);
  const { verify, resendVerification, loading, error, clearError } = useAuth();

  const token = searchParams.get("token");

  useEffect(() => {
    if (verificationInitiatedRef.current) {
      return;
    }

    if (!token) {
      setStatus("error");
      verificationInitiatedRef.current = true;
      setCanResend(false);
      return;
    }

    verificationInitiatedRef.current = true;

    const handleVerification = async () => {
      setStatus("verifying");
      setCanResend(false);
      clearError();

      console.log(`Attempting to verify email with token: ${token}`);
      try {
        const success = await verify(token);

        if (success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setCanResend(true);
        }
      } catch (err) {
        // Ensure we handle any exceptions
        console.error("Verification error:", err);
        setStatus("error");
        setCanResend(true);
      }
    };

    handleVerification();
  }, [token, router, clearError, verify]);

  const handleResend = async () => {
    if (!token) {
      setResendMessage("Token is missing. Cannot proceed.");
      router.push("/login");
      return;
    }
    setResendMessage(null);
    clearError();

    const success = await resendVerification({ token });
    if (success) {
      setResendMessage("Verification email sent successfully.");
      setCanResend(false);
    }
  };

  // Styling to match login page
  const buttonStyle =
    "w-full px-6 py-4 mt-4 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/20 transition-all";

  const renderStatus = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="flex flex-col items-center space-y-4">
            <Spinner />
            <p className="text-lg font-medium text-white/80">
              Verifying your email...
            </p>
          </div>
        );
      case "success":
        return (
          <motion.div
            className="text-center space-y-4"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="mx-auto h-16 w-16 text-[#00BFA5] flex items-center justify-center"
              variants={fadeIn}
              custom={0.3}
            >
              <CheckCircle className="w-full h-full" />
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-white"
              variants={fadeIn}
              custom={0.4}
            >
              Verification Successful!
            </motion.h3>
            <motion.p className="text-white/70" variants={fadeIn} custom={0.5}>
              Your email has been successfully verified.
            </motion.p>
            <motion.p
              className="text-sm text-white/50"
              variants={fadeIn}
              custom={0.6}
            >
              Redirecting to login shortly...
            </motion.p>
            <motion.div
              variants={fadeIn}
              custom={0.7}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="inline-block text-teal-400 hover:text-teal-300 font-medium hover:underline"
              >
                Go to Login now
              </Link>
            </motion.div>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            className="text-center space-y-4"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="mx-auto h-16 w-16 text-red-400 flex items-center justify-center"
              variants={fadeIn}
              custom={0.3}
            >
              <AlertCircle className="w-full h-full" />
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-white"
              variants={fadeIn}
              custom={0.4}
            >
              Verification Failed
            </motion.h3>
            <motion.p className="text-red-400" variants={fadeIn} custom={0.5}>
              {error || "Verification token is missing or invalid."}
            </motion.p>
            {canResend && (
              <motion.div variants={fadeIn} custom={0.6} className="mt-6">
                <motion.button
                  onClick={handleResend}
                  disabled={loading}
                  className={buttonStyle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? "Sending..." : "Resend Verification Email"}
                    {!loading && (
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
                    )}
                  </span>
                </motion.button>
                {resendMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-sm ${
                      resendMessage.includes("success")
                        ? "text-teal-400"
                        : "text-red-400"
                    }`}
                  >
                    {resendMessage}
                  </motion.p>
                )}
              </motion.div>
            )}
            <motion.div
              variants={fadeIn}
              custom={0.7}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="mt-4 inline-block text-teal-400 hover:text-teal-300 font-medium hover:underline"
              >
                Return to Login
              </Link>
            </motion.div>
          </motion.div>
        );
      case "idle":
      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-8 pb-12 overflow-hidden bg-black">
      {/* Animated background elements - same as login page */}
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

      <motion.div
        className="absolute top-2 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 bg-[#1E1E1E]/70 backdrop-blur-sm rounded-lg border border-white/10 text-white hover:bg-[#2D2D2D]/70 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-sm font-medium hidden lg:block">
            Back to Home
          </span>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-md mx-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6"
            variants={fadeIn}
            custom={0}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Shield className="w-4 h-4 text-[#00BFA5]" />
            <span className="text-sm font-medium text-white">
              Private & Secure
            </span>
          </motion.div>

          <motion.div
            className="bg-[#1E1E1E] rounded-2xl border border-white/10 p-8 shadow-xl relative z-10 overflow-hidden"
            variants={fadeIn}
            custom={0.2}
          >
            <motion.div
              className="h-14 bg-gradient-to-r from-[#6200EA]/80 to-[#00BFA5]/80 flex items-center px-4 rounded-t-lg -mx-8 -mt-8 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-white/20 mr-3 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Lock className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <div className="text-white font-medium">Email Verification</div>
                <div className="text-white/60 text-xs">Whispr Account</div>
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold mb-6 text-white"
              variants={fadeIn}
              custom={0.3}
            >
              Verify your{" "}
              <motion.span
                className="text-teal-400 relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                Email
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            {renderStatus()}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-400 mt-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.5 },
              },
            }}
          >
            <motion.div
              className="flex items-center space-x-2"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.8)" }}
            >
              <Lock className="w-4 h-4 text-[#00BFA5]" />
              <span>End-to-end privacy</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.8)" }}
            >
              <Shield className="w-4 h-4 text-[#00BFA5]" />
              <span>Secure account</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.05, color: "rgba(255,255,255,0.8)" }}
            >
              <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
              <span>No data collection</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const EmailVerificationPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <section className="relative min-h-screen flex items-center justify-center bg-black">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#6200EA]/20 rounded-full filter blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00BFA5]/20 rounded-full filter blur-3xl" />
          </div>
          <Spinner />
        </section>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
};

export default EmailVerificationPage;
