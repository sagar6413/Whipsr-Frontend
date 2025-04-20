"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ResetPasswordSchema,
  ResetPasswordInput,
} from "../../../lib/validators/authValidators"; // Adjust path
import { resetPassword } from "../../../services/authService"; // Adjust path
import AuthForm from "../../../components/auth/AuthForm"; // Adjust path
import { AxiosApiError } from "../../../types/api"; // Adjust path

// Simple Spinner
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
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

  // Reusable styles
  const inputStyle =
    "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
  const buttonStyle =
    "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
  const errorTextStyle = "mt-1 text-xs text-red-600";
  const linkStyle = "font-medium text-indigo-600 hover:text-indigo-500";
  const successMessageStyle =
    "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative";

  // Show error if token is invalid from the start
  if (!token && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg rounded-lg text-center">
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
          <h3 className="text-xl font-semibold text-gray-900">Invalid Link</h3>
          <p className="text-red-600">{error}</p>
          <Link
            href="/forgot-password"
            className={`mt-4 inline-block ${linkStyle}`}
          >
            Request a new password reset link
          </Link>
          <br />
          <Link href="/login" className={`mt-2 inline-block ${linkStyle}`}>
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  // Render nothing or a loader if token is being checked initially
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthForm
      title="Reset Your Password"
      description="Enter and confirm your new password."
      onSubmit={handleSubmit(onSubmit)}
      errorMessage={error} // General error message
      isLoading={isLoading}
    >
      {successMessage && (
        <div className={successMessageStyle} role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">
            {successMessage} Redirecting to login...
          </span>
        </div>
      )}

      {/* New Password Input */}
      <div>
        <label htmlFor="newPassword" className="sr-only">
          New Password
        </label>
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
      </div>

      {/* Confirm New Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm New Password
        </label>
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
          <p className={errorTextStyle}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className={buttonStyle}
          disabled={isLoading || !!successMessage}
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>
      </div>

      {/* Link back to Login (optional, as it redirects on success) */}
      {!successMessage && (
        <div className="text-sm text-center mt-4">
          <Link href="/login" className={linkStyle}>
            Cancel and return to Sign in
          </Link>
        </div>
      )}
    </AuthForm>
  );
};

// Wrap with Suspense
const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
