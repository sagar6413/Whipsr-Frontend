"use client";

import React from "react";
// Removed service/type imports related to fetching providers

// Assuming you have icons for Google, GitHub etc.
// import { FaGoogle, FaGithub } from 'react-icons/fa';

// Placeholder icons - accept className prop
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className}>G</span>
);
const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className}>GH</span>
);

const OAuthButtons: React.FC = () => {
  // No need for provider state, loading, or error state anymore

  // Determine Backend Base URL (similar to api.ts, but only need base)
  // In production, relative URL might work if served from the same domain/proxy
  // In development, we need the explicit backend URL.
  const backendBaseUrl =
    process.env.NODE_ENV === "production"
      ? "" // Use relative path in production (or configure if different domain)
      : process.env.NEXT_PUBLIC_API_BASE_URL_OAUTH_DEV || "http://localhost:8080"; // Use explicit dev URL

  const backendOAuthUrl = (provider: string) =>
    `${backendBaseUrl}/oauth2/authorization/${provider}`;

  const handleOAuthLogin = (provider: string) => {
    const url = backendOAuthUrl(provider);
    console.log(`Redirecting to backend OAuth: ${url}`);
    window.location.href = url; // Redirect to the full backend endpoint URL
  };

  // Basic Tailwind styling - customize as needed
  const buttonBaseStyle =
    "flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
  const iconStyle = "mr-2 h-5 w-5";

  // We assume Google and GitHub are potentially available.
  // If the backend doesn't support one, clicking the button will just lead to a 404
  // on the backend, which is acceptable for this simplified approach.
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className={buttonBaseStyle}
        >
          <GoogleIcon className={iconStyle} />
          Google
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          className={buttonBaseStyle}
        >
          <GithubIcon className={iconStyle} />
          GitHub
        </button>
        {/* Add buttons for other providers similarly */}
      </div>
    </div>
  );
};

export default OAuthButtons;
