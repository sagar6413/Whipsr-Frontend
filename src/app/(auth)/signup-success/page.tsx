"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Lock,
  CheckCircle,
  Mail,
} from "lucide-react";

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

const SignupSuccessPage: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-8 pb-12 overflow-hidden bg-black">
      {/* Animated background elements */}
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

      {/* Back button */}
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
          <ArrowLeft className="w-4 h-4" />
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
          {/* Privacy badge */}
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
                <CheckCircle className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <div className="text-white font-medium">Account Created</div>
                <div className="text-white/60 text-xs">Verification Needed</div>
              </div>
            </motion.div>

            {/* Success content */}
            <motion.div className="text-center" variants={fadeIn} custom={0.3}>
              <motion.div
                className="w-16 h-16 rounded-full bg-[#00BFA5]/20 flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-8 h-8 text-[#00BFA5]" />
              </motion.div>

              <motion.h1
                className="text-2xl font-bold mb-3 text-white"
                variants={fadeIn}
                custom={0.3}
              >
                Signup{" "}
                <motion.span
                  className="text-teal-400 relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  Successful!
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-gray-400 mb-6"
                variants={fadeIn}
                custom={0.4}
              >
                Please check your inbox to verify your email address. We&apos;ve
                sent you a confirmation link to complete your registration.
              </motion.p>

              <motion.div
                className="mb-6 p-4 bg-[#2D2D2D] border border-white/10 rounded-lg"
                variants={fadeIn}
                custom={0.5}
              >
                <div className="flex items-start text-left">
                  <ShieldCheck className="w-5 h-5 text-[#00BFA5] mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Didn&apos;t receive an email? Check your spam folder or{" "}
                    <Link
                      href="/resend-verification"
                      className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
                    >
                      click here to resend
                    </Link>
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                custom={0.6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/login"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#6200EA]/20 transition-all inline-block"
                >
                  <span className="flex items-center justify-center">
                    Go to Login
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatDelay: 2,
                      }}
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Feature list with stagger */}
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

export default SignupSuccessPage;
