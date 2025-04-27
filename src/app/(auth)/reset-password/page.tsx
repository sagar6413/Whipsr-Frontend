"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Shield,
  ShieldCheck,
  Key,
  RefreshCcw,
} from "lucide-react";
import {
  ResetPasswordSchema,
  ResetPasswordInput,
} from "../../../lib/validators/authValidators"; // Adjust path
import { resetPassword } from "../../../services/authService"; // Adjust path
import { AxiosApiError } from "../../../types/api"; // Adjust path

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

const inputAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// Simple Spinner component with styling that matches the design
const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <motion.div
      className="w-8 h-8 border-4 border-white/10 border-t-[#00BFA5] rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

// Inner component using search params
const ResetPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const initialCheckDoneRef = useRef(false);

  useEffect(() => {
    if (initialCheckDoneRef.current) {
      return;
    }
    initialCheckDoneRef.current = true;

    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setError("Password reset token is missing or invalid.");
      // Optionally redirect
      // router.push('/login');
    } else {
      setToken(urlToken);
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Clear error/success message on unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
    if (!token) {
      setError("Password reset token is missing. Cannot proceed.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = { ...data, token };
      const response = await resetPassword(payload);
      setSuccessMessage(
        response.message || "Password has been reset successfully."
      );
      reset();
      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const axiosError = err as AxiosApiError;
      const apiError = axiosError.response?.data;
      if (apiError?.errors) {
        apiError.errors.forEach((e) => {
          if (e.field === "newPassword" || e.field === "confirmPassword") {
            setFormError(e.field as "newPassword" | "confirmPassword", {
              type: "manual",
              message: e.message,
            });
          } else if (e.field === "token") {
            // Handle invalid token error specifically
            setError(e.message || "Invalid or expired password reset token.");
          }
        });
        if (!error && errors) setError("Please correct the errors above."); // Set general error only if token error wasn't set
      } else {
        setError(
          apiError?.message || "An unknown error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Styling - matching login page
  const inputContainerStyle = "relative mb-4";
  const inputStyle =
    "w-full px-4 py-3 pl-10 bg-[#2D2D2D] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition-all duration-300";
  const inputIconStyle = "absolute left-3 top-3.5 text-gray-400";
  const errorTextStyle = "mt-1 text-sm text-red-400";
  const buttonStyle =
    "w-full px-6 py-4 mt-4 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/20 transition-all";

  // Show error if token is invalid from the start
  if (!token && error) {
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
            href="/login"
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
              Back to Login
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="max-w-md w-full mx-auto bg-[#1E1E1E] p-8 shadow-xl rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <Lock className="w-8 h-8 text-red-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white">Invalid Link</h3>
            <p className="text-red-400 mt-2">{error}</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/forgot-password"
                className="block w-full px-4 py-2 bg-[#2D2D2D] rounded-lg text-teal-400 border border-white/10 hover:bg-[#3D3D3D] transition-colors"
              >
                Request a new password reset link
              </Link>
              <Link
                href="/login"
                className="block w-full px-4 py-2 bg-gradient-to-r from-[#6200EA]/80 to-[#00BFA5]/80 rounded-lg text-white hover:shadow-lg hover:shadow-[#6200EA]/20 transition-all"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Render loader if token is being checked initially
  if (!token) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-black">
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
        </div>
        <Spinner />
      </section>
    );
  }

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
          href="/login"
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
            Back to Login
          </span>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-md mx-auto"
          initial="hidden"
          animate="visible"
        >
          {/* Privacy badge - same as login page */}
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
            {/* Gradient header bar */}
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
                <RefreshCcw className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <div className="text-white font-medium">Reset Password</div>
                <div className="text-white/60 text-xs">
                  Secure your Whispr account
                </div>
              </div>
            </motion.div>

            {/* Form title */}
            <motion.h1
              className="text-2xl font-bold mb-6 text-white"
              variants={fadeIn}
              custom={0.3}
            >
              New password for{" "}
              <motion.span
                className="text-teal-400 relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                Whispr
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            {/* Success message display */}
            {successMessage && (
              <motion.div
                className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  <span>{successMessage} Redirecting to login...</span>
                </div>
              </motion.div>
            )}

            {/* Error message display */}
            {error && !successMessage && (
              <motion.div
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* New Password Input */}
              <motion.div
                className={inputContainerStyle}
                variants={inputAnimation}
                custom={0.4}
              >
                <Key className={`w-5 h-5 ${inputIconStyle}`} />
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`${inputStyle} ${
                    errors.newPassword ? "border-red-500" : ""
                  }`}
                  placeholder="New Password (min. 8 characters)"
                  {...register("newPassword")}
                  disabled={isLoading || !!successMessage}
                />
                {errors.newPassword && (
                  <p className={errorTextStyle}>{errors.newPassword.message}</p>
                )}
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                className={inputContainerStyle}
                variants={inputAnimation}
                custom={0.5}
              >
                <ShieldCheck className={`w-5 h-5 ${inputIconStyle}`} />
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`${inputStyle} ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm New Password"
                  {...register("confirmPassword")}
                  disabled={isLoading || !!successMessage}
                />
                {errors.confirmPassword && (
                  <p className={errorTextStyle}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={fadeIn}
                custom={0.7}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  className={buttonStyle}
                  disabled={isLoading || !!successMessage}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                    {!isLoading && (
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
                </button>
              </motion.div>

              {/* Link to Login */}
              {!successMessage && (
                <motion.div
                  className="text-center mt-6"
                  variants={fadeIn}
                  custom={0.9}
                >
                  <p className="text-gray-400">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Feature list with stagger - same as login page */}
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

// Wrap with Suspense
const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <section className="relative min-h-screen flex items-center justify-center bg-black">
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
          </div>
          <Spinner />
        </section>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
