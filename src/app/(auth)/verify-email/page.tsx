"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  verifyEmail,
  resendVerificationEmail,
} from "../../../services/authService"; // Adjust path
import { AxiosApiError } from "../../../types/api"; // Adjust path
import Link from "next/link";

// Define verification status types
type VerificationStatus = "verifying" | "success" | "error" | "idle";

// A simple spinner component (replace with your actual spinner)
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
);

// Inner component that uses useSearchParams
const EmailVerificationContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const verificationInitiatedRef = useRef(false);

  const token = searchParams.get("token");
  // Optionally get email from params if needed for resend functionality
  const emailForResend = searchParams.get("email");

  useEffect(() => {
    if (verificationInitiatedRef.current) {
      return;
    }

    if (!token) {
      if (status === "idle") {
        setMessage("Verification token is missing or invalid.");
        setStatus("error");
        verificationInitiatedRef.current = true;
      }
      return;
    }

    verificationInitiatedRef.current = true;

    const handleVerification = async () => {
      setStatus("verifying");
      setMessage(null);
      setCanResend(false);
      try {
        console.log(`Attempting to verify email with token: ${token}`);
        const response = await verifyEmail(token);
        console.log("Email verification response message:", response.message);

        setMessage(response.message || "Email verified successfully!");
        setStatus("success");
        // Automatically redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        const axiosError = error as AxiosApiError;
        const errorMessage =
          axiosError.response?.data?.message ||
          "An error occurred during verification.";
        setMessage(errorMessage);
        setStatus("error");
        // Allow resend if the error indicates an invalid/expired token and we have an email
        // This logic might need adjustment based on your API's specific error responses
        if (
          emailForResend &&
          (axiosError.response?.status === 400 ||
            axiosError.response?.status === 422)
        ) {
          setCanResend(true);
        }
      }
    };

    handleVerification();
  }, [token, router, emailForResend, status]);

  const handleResend = async () => {
    if (!emailForResend) {
      setResendMessage(
        "Email address not available for resending verification."
      );
      return;
    }
    setIsResending(true);
    setResendMessage(null);
    try {
      // Assume resendVerificationEmail service exists
      const response = await resendVerificationEmail(emailForResend);
      setResendMessage(
        response.message || "Verification email sent successfully."
      );
      setCanResend(false); // Disable resend after successful attempt
    } catch (error) {
      const axiosError = error as AxiosApiError;
      setResendMessage(
        axiosError.response?.data?.message ||
          "Failed to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="flex flex-col items-center space-y-4">
            <Spinner />
            <p className="text-lg font-medium text-gray-700">
              Verifying your email...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900">
              Verification Successful!
            </h3>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login shortly...
            </p>
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Go to Login now
            </Link>
          </div>
        );
      case "error":
        return (
          <div className="text-center space-y-4">
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
              Verification Failed
            </h3>
            <p className="text-red-600">{message}</p>
            {canResend && (
              <div className="mt-6">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
                {resendMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      resendMessage.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
            <Link
              href="/login"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Login
            </Link>
          </div>
        );
      case "idle":
      default:
        return null; // Or some initial state message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg rounded-lg">
        {renderStatus()}
      </div>
    </div>
  );
};

// Wrap the component with Suspense for useSearchParams
const EmailVerificationPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
};

export default EmailVerificationPage;
