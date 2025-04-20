"use client";

import React, { useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import {
  LoginSchema,
  LoginInput,
} from "../../../lib/validators/authValidators"; // Adjust path
import { AuthContext } from "../../../contexts/AuthContext"; // Remove AuthContextType
import AuthForm from "../../../components/auth/AuthForm"; // Adjust path
import OAuthButtons from "../../../components/auth/OAuthButtons"; // Adjust path

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext); // Use context

  // Add check for undefined context
  if (!authContext) {
    throw new Error("LoginPage must be used within an AuthProvider");
  }

  const {
    login,
    isLoading,
    error: authError, // Rename to avoid conflict with component state if any
    isAuthenticated,
    clearError,
  } = authContext; // Destructure from context

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError, // Use setError from react-hook-form for field-specific errors
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to profile page
      router.push("/"); // Changed from /dashboard
    }
  }, [isAuthenticated]);

  // Clear auth context error when component unmounts or form is interacted with
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Handle API errors from context
  useEffect(() => {
    if (authError) {
      if (authError.errors) {
        // Set field-specific errors
        authError.errors.forEach((err) => {
          if (err.field === "email" || err.field === "password") {
            setFormError(err.field as "email" | "password", {
              type: "manual",
              message: err.message,
            });
          }
        });
      }
      // General error message is handled by AuthForm component via the 'error' prop
    }
  }, [authError, setFormError]);

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    clearError(); // Clear previous errors before new attempt
    await login(data); // Call login from context
    // Redirect is handled by the useEffect above
    console.log("Login successful");
  };

  // Basic Tailwind styles - customize as needed
  const inputStyle =
    "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
  const buttonStyle =
    "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
  const errorTextStyle = "mt-1 text-xs text-red-600";
  const linkStyle = "font-medium text-indigo-600 hover:text-indigo-500";

  return (
    <AuthForm
      title="Sign in to your account"
      onSubmit={handleSubmit(onSubmit)}
      errorMessage={authError && !authError.errors ? authError.message : null} // Use authError
      isLoading={isLoading}
    >
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
        />
        {errors.email && (
          <p className={errorTextStyle}>{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${inputStyle} ${errors.password ? "border-red-500" : ""}`}
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className={errorTextStyle}>{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password / Register Links */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          {/* Optional: Remember me checkbox */}
          {/* <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-gray-900"> Remember me </label> */}
        </div>
        <div className="text-sm">
          <Link href="/forgot-password" className={linkStyle}>
            Forgot your password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button type="submit" className={buttonStyle} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons />

      {/* Link to Register */}
      <div className="text-sm text-center mt-4">
        <p className="text-gray-600">
          Don&apos;t have an account?
          <Link href="/signup" className={`ml-1 ${linkStyle}`}>
            Sign up
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default LoginPage;
