"use client";

import React from "react";
import { motion } from "framer-motion";

// Import Lucide icons instead of placeholders
import { Github, Mail, Chrome } from "lucide-react";

const OAuthButtons: React.FC = () => {
  // Backend URL logic remains the same
  const backendBaseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_BASE_URL_OAUTH_PROD
      : process.env.NEXT_PUBLIC_API_BASE_URL_OAUTH_DEV ||
        "http://localhost:8080";

  const backendOAuthUrl = (provider: string) =>
    `${backendBaseUrl}/oauth2/authorization/${provider}`;

  const handleOAuthLogin = (provider: string) => {
    const url = backendOAuthUrl(provider);
    console.log(`Redirecting to backend OAuth: ${url}`);
    window.location.href = url;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="mt-6">
      {/* Divider with animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#1E1E1E] text-gray-400">
            Or continue with
          </span>
        </div>
      </motion.div>

      {/* OAuth Buttons Grid */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Google Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            backgroundColor: "rgba(255,255,255,0.12)",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white hover:shadow-md transition-all duration-300"
        >
          <Chrome className="w-5 h-5 text-[#00BFA5]" />
          <span>Google</span>
        </motion.button>

        {/* GitHub Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            backgroundColor: "rgba(255,255,255,0.12)",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => handleOAuthLogin("github")}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2D2D2D] border border-white/10 rounded-lg text-white hover:shadow-md transition-all duration-300"
        >
          <Github className="w-5 h-5 text-[#00BFA5]" />
          <span>GitHub</span>
        </motion.button>
      </motion.div>

      {/* Optional: Additional auth method button */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-4"
      >
        <motion.button
          variants={itemVariants}
          whileHover={{
            backgroundColor: "rgba(255,255,255,0.08)",
            transition: { duration: 0.2 },
          }}
          type="button"
          className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-transparent border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm">Use magic link instead</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OAuthButtons;
