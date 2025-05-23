"use client";

import React, { useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, ShieldCheck, Mail, Key } from "lucide-react";
import { LoginSchema, LoginInput } from "../../../utils/authValidators";
import OAuthButtons from "../../../components/auth/OAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { isAuthenticated } from "@/utils/cookieManager";

// Animation variants - same as signup page
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

const LoginPage: React.FC = () => {
  const { signin, error, loading, clearError } = useAuth();
  const router = useRouter();
  console.log("Loaded", isAuthenticated());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectToChat = useCallback(() => {
    router.push("/chat");
  }, [router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      redirectToChat();
    }
  }, [redirectToChat]);

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    clearError();

    const success = await signin(data);
    if (success) {
      console.log("Login is successfull :-)");
      console.log(isAuthenticated);
      reset();
      router.push("/chat");
    }
  };

  // Same styling as signup page
  const inputContainerStyle = "relative mb-4";
  const inputStyle =
    "w-full px-4 py-3 pl-10 bg-[#2D2D2D] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition-all duration-300";
  const inputIconStyle = "absolute left-3 top-3.5 text-gray-400";
  const errorTextStyle = "mt-1 text-sm text-red-400";
  const buttonStyle =
    "w-full px-6 py-4 mt-4 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/20 transition-all";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-8 pb-12 overflow-hidden bg-black">
      {/* Animated background elements - same as signup page */}
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
          {/* Privacy badge - same as signup page */}
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
                <Lock className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <div className="text-white font-medium">Welcome Back</div>
                <div className="text-white/60 text-xs">Sign in to Whispr</div>
              </div>
            </motion.div>

            {/* Form title */}
            <motion.h1
              className="text-2xl font-bold mb-6 text-white"
              variants={fadeIn}
              custom={0.3}
            >
              Sign in to{" "}
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

            {/* Error message display */}
            {error && Object.keys(errors).length === 0 && (
              <motion.div
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <motion.div
                className={inputContainerStyle}
                variants={inputAnimation}
                custom={0.4}
              >
                <Mail className={`w-5 h-5 ${inputIconStyle}`} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`${inputStyle} ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Email address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={errorTextStyle}>{errors.email.message}</p>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div
                className={inputContainerStyle}
                variants={inputAnimation}
                custom={0.5}
              >
                <Key className={`w-5 h-5 ${inputIconStyle}`} />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`${inputStyle} ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className={errorTextStyle}>{errors.password.message}</p>
                )}
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div
                className="flex justify-end mb-2"
                variants={inputAnimation}
                custom={0.6}
              >
                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-400 hover:text-teal-300 hover:underline"
                >
                  Forgot your password?
                </Link>
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
                  className={`${buttonStyle} relative overflow-hidden`}
                  disabled={loading}
                >
                  {/* Background pulse effect when loading */}
                  {loading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#6200EA]/80 to-[#00BFA5]/80"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Hover gradient animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00BFA5]/40 to-[#6200EA]/40"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <motion.div className="flex items-center">
                        Signing in
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: "loop",
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                          }}
                        >
                          ...
                        </motion.span>
                        <motion.div
                          className="ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div className="flex items-center">
                        Sign in
                        <motion.span
                          className="ml-2 flex items-center"
                          animate={{
                            x: [0, 5, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            repeatDelay: 1,
                            ease: "easeOut",
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </motion.div>
                    )}
                  </span>

                  {/* Decorative particles that appear on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial="hidden"
                    whileHover="visible"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                        initial={{
                          x: "50%",
                          y: "100%",
                          opacity: 0,
                        }}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            y: ["100%", "-100%"],
                            x: [`${50 + (i - 2) * 30}%`],
                            opacity: [0, 0.8, 0],
                            transition: {
                              duration: 1 + i * 0.2,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeOut",
                            },
                          },
                        }}
                      />
                    ))}
                  </motion.div>
                </button>
              </motion.div>

              {/* OAuth Buttons */}
              <motion.div className="mt-6" variants={fadeIn} custom={0.8}>
                <OAuthButtons />
              </motion.div>

              {/* Link to Signup */}
              <motion.div
                className="text-center mt-6"
                variants={fadeIn}
                custom={0.9}
              >
                <p className="text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>

          {/* Feature list with stagger - same as signup page */}
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

export default LoginPage;
