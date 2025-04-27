"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ShieldCheck } from "lucide-react";

interface AuthFormProps {
  title: string;
  description?: string; // Optional description
  children: ReactNode; // The form fields and submit button
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // Form submission handler
  errorMessage?: string | null; // Optional error message to display
  isLoading?: boolean; // Optional loading state for disabling form/button
  headerIcon?: ReactNode; // Optional custom icon for the header
  headerTitle?: string; // Optional custom title for the header bar
  headerSubtitle?: string; // Optional custom subtitle for the header bar
}

// Animation variants
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

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  description,
  children,
  onSubmit,
  errorMessage,
  isLoading = false,
  headerIcon,
  headerTitle = "Whispr Account",
  headerSubtitle = "Secure Authentication",
}) => {
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
                {headerIcon || <Lock className="w-4 h-4 text-white" />}
              </motion.div>
              <div>
                <div className="text-white font-medium">{headerTitle}</div>
                <div className="text-white/60 text-xs">{headerSubtitle}</div>
              </div>
            </motion.div>

            {/* Form title */}
            <motion.h1
              className="text-2xl font-bold mb-3 text-white"
              variants={fadeIn}
              custom={0.3}
            >
              {title.split(" ").map((word, index, array) =>
                index === array.length - 1 ? (
                  <motion.span
                    key={index}
                    className="text-teal-400 relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    {index > 0 ? " " : ""}
                    {word}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    />
                  </motion.span>
                ) : (
                  <span key={index}>
                    {index > 0 ? " " : ""}
                    {word}
                  </span>
                )
              )}
            </motion.h1>

            {/* Form description */}
            {description && (
              <motion.p
                className="text-gray-400 mb-6"
                variants={fadeIn}
                custom={0.4}
              >
                {description}
              </motion.p>
            )}

            {/* Error message display */}
            {errorMessage && (
              <motion.div
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Form content */}
            <motion.form
              onSubmit={onSubmit}
              noValidate
              className="space-y-4"
              variants={fadeIn}
              custom={0.5}
            >
              <fieldset disabled={isLoading}>{children}</fieldset>
            </motion.form>
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

export default AuthForm;
