"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Simple Spinner (reuse or import)
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
);

// Status is simpler now: just processing or error
type Status = "processing" | "error";

const OAuthRedirectContent: React.FC = () => {
  console.log("OAuthRedirectContent");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const refreshToken = searchParams.get("refreshToken");
    console.log("token", token);
    console.log("error", error);
    console.log("refreshToken", refreshToken);

    if (error) {
      console.error("OAuth Error:", error);
      setErrorMessage(
        decodeURIComponent(error) || "An error occurred during authentication."
      );
      setStatus("error");
    } else if (token && refreshToken) {
      console.log("OAuth Success: Tokens received. Storing and redirecting...");
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      // Redirect immediately to home page
      router.push("/");
      console.log("Redirecting to home page");
      // No need to setStatus('success') as we redirect away
    } else {
      console.error("OAuth Error: Missing token or refreshToken in redirect.");
      setErrorMessage("Invalid authentication response from server.");
      setStatus("error");
    }

    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Render only processing or error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg rounded-lg text-center">
        {status === "processing" && (
          <div className="flex flex-col items-center space-y-4">
            <Spinner />
            <p className="text-lg font-medium text-gray-700">
              Processing authentication...
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
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
            <h3 className="text-xl font-semibold text-gray-900">
              Authentication Failed
            </h3>
            <p className="text-red-600">
              {errorMessage || "An unknown error occurred."}
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap the component with Suspense for useSearchParams
const OAuthRedirectPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <OAuthRedirectContent />
    </Suspense>
  );
};

export default OAuthRedirectPage;
