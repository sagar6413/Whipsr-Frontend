"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SignupSchema,
  SignupInput,
} from "../../../lib/validators/authValidators"; // Adjust path
import { useAuth } from "../../../hooks/useAuth"; // Adjust path
import AuthForm from "../../../components/auth/AuthForm"; // Adjust path
import OAuthButtons from "../../../components/auth/OAuthButtons"; // Adjust path

const SignupPage: React.FC = () => {
  console.log("SignupPage");
  const { signup, isLoading, error, isAuthenticated, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      router.push("/"); // Adjust target route
    }
  }, [isAuthenticated]);

  // Clear auth context error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Handle API errors from context
  useEffect(() => {
    if (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          if (
            err.field === "email" ||
            err.field === "password" ||
            err.field === "confirmPassword" ||
            err.field === "firstName" ||
            err.field === "lastName"
          ) {
            setFormError(
              err.field as
                | "email"
                | "password"
                | "confirmPassword"
                | "firstName"
                | "lastName",
              { type: "manual", message: err.message }
            );
          } else {
            // Handle other potential specific errors if needed, e.g., general validation
            console.warn("Unhandled API field error:", err);
          }
        });
      }
      // General error message is handled by AuthForm
    }
  }, [error, setFormError]);

  const onSubmit: SubmitHandler<SignupInput> = async (data) => {
    clearError();
    // We don't need to send acceptTerms to the backend, it's just for frontend validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { acceptTerms, ...signupData } = data;

    try {
      await signup(signupData);
      // Redirect to success page instead of dashboard
      router.push("/signup-success");
    } catch (err) {
      // Error handling is managed by the AuthContext and useEffect below
      // We don't need to do anything specific here unless we want page-specific
      // feedback beyond what the context/form provides.
      console.error("Signup page onSubmit caught error:", err);
    }
    // Redirect is handled by useEffect OR the push above
    // No longer relying on isAuthenticated state change for redirect here
  };

  // Reusable styles from LoginPage (consider moving to a shared location)
  const inputStyle =
    "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
  const buttonStyle =
    "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
  const errorTextStyle = "mt-1 text-xs text-red-600";
  const linkStyle = "font-medium text-indigo-600 hover:text-indigo-500";
  const checkboxStyle =
    "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded";

  return (
    <AuthForm
      title="Create your account"
      description="Start your journey with us today."
      onSubmit={handleSubmit(onSubmit)}
      errorMessage={error && !error.errors ? error.message : null}
      isLoading={isLoading}
    >
      {/* First Name Input */}
      <div>
        <label htmlFor="firstName" className="sr-only">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          autoComplete="given-name"
          required
          className={`${inputStyle} ${
            errors.firstName ? "border-red-500" : ""
          }`}
          placeholder="First Name"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className={errorTextStyle}>{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name Input */}
      <div>
        <label htmlFor="lastName" className="sr-only">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          autoComplete="family-name"
          required
          className={`${inputStyle} ${errors.lastName ? "border-red-500" : ""}`}
          placeholder="Last Name"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className={errorTextStyle}>{errors.lastName.message}</p>
        )}
      </div>

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
          autoComplete="new-password"
          required
          className={`${inputStyle} ${errors.password ? "border-red-500" : ""}`}
          placeholder="Password (min. 8 characters)"
          {...register("password")}
        />
        {errors.password && (
          <p className={errorTextStyle}>{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className={`${inputStyle} ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className={errorTextStyle}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-center">
        <input
          id="acceptTerms"
          type="checkbox"
          className={`${checkboxStyle} ${
            errors.acceptTerms ? "border-red-500" : ""
          }`}
          {...register("acceptTerms")}
        />
        <label
          htmlFor="acceptTerms"
          className="ml-2 block text-sm text-gray-900"
        >
          I accept the{" "}
          <Link href="/terms" className={linkStyle}>
            Terms and Conditions
          </Link>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className={errorTextStyle}>{errors.acceptTerms.message}</p>
      )}

      {/* Submit Button */}
      <div>
        <button type="submit" className={buttonStyle} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons />

      {/* Link to Login */}
      <div className="text-sm text-center mt-4">
        <p className="text-gray-600">
          Already have an account?
          <Link href="/login" className={`ml-1 ${linkStyle}`}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default SignupPage;
