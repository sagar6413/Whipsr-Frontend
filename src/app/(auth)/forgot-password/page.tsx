"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  ForgotPasswordSchema,
  ForgotPasswordInput,
} from "../../../lib/validators/authValidators"; // Adjust path
import { requestPasswordReset } from "../../../services/authService"; // Adjust path
import AuthForm from "../../../components/auth/AuthForm"; // Adjust path
import { AxiosApiError } from "../../../types/api"; // Adjust path

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset, // To clear the form on success
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Clear error/success message on unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await requestPasswordReset(data);
      setSuccessMessage(
        response.message ||
          "Password reset email sent successfully. Please check your inbox."
      );
      reset(); // Clear the form
    } catch (err) {
      const axiosError = err as AxiosApiError;
      const apiError = axiosError.response?.data;
      if (apiError?.errors) {
        apiError.errors.forEach((e) => {
          if (e.field === "email") {
            setFormError("email", { type: "manual", message: e.message });
          }
        });
        setError("Please correct the errors above."); // General message if field errors exist
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

  return (
    <AuthForm
      title="Forgot Your Password?"
      description="Enter your email address and we will send you a link to reset your password."
      onSubmit={handleSubmit(onSubmit)}
      errorMessage={error} // Pass the general error message to AuthForm
      isLoading={isLoading}
    >
      {/* Display Success Message */}
      {successMessage && (
        <div className={successMessageStyle} role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className={`${inputStyle} ${errors.email ? "border-red-500" : ""}`}
          placeholder="Email address"
          {...register("email")}
          disabled={isLoading || !!successMessage} // Disable if loading or success
        />
        {errors.email && (
          <p className={errorTextStyle}>{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className={buttonStyle}
          disabled={isLoading || !!successMessage} // Disable if loading or success
        >
          {isLoading ? "Sending..." : "Send Password Reset Email"}
        </button>
      </div>

      {/* Link back to Login */}
      <div className="text-sm text-center mt-4">
        <Link href="/login" className={linkStyle}>
          Return to Sign in
        </Link>
      </div>
    </AuthForm>
  );
};

export default ForgotPasswordPage;
