"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  ChangePasswordInput,
} from "../../lib/validators/authValidators"; // Adjust path
import { changePassword } from "../../services/userService"; // Adjust path
import { AxiosApiError } from "../../types/api"; // Adjust path

const ChangePasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError: setFormError,
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  const onSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await changePassword(data);
      setSuccessMessage(response.message || "Password changed successfully!");
      reset(); // Clear the form
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const axiosError = err as AxiosApiError;
      const apiError = axiosError.response?.data;
      if (apiError?.errors) {
        apiError.errors.forEach((e) => {
          // Map specific field errors
          if (
            e.field === "currentPassword" ||
            e.field === "newPassword" ||
            e.field === "confirmPassword"
          ) {
            setFormError(
              e.field as "currentPassword" | "newPassword" | "confirmPassword",
              { type: "manual", message: e.message }
            );
          }
        });
        setError("Please correct the errors above.");
      } else {
        setError(
          apiError?.message ||
            "An unknown error occurred while changing password."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Common styles
  const inputStyle =
    "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100";
  const buttonStyle =
    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const errorTextStyle = "mt-1 text-xs text-red-600";
  const successMessageStyle = "mt-2 text-sm text-green-600";
  const generalErrorStyle = "mt-2 text-sm text-red-600";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Change Password
      </h3>
      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={`${inputStyle} ${
            errors.currentPassword ? "border-red-500" : ""
          }`}
          {...register("currentPassword")}
          disabled={isLoading}
        />
        {errors.currentPassword && (
          <p className={errorTextStyle}>{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
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
          placeholder="Min. 8 characters"
          {...register("newPassword")}
          disabled={isLoading}
        />
        {errors.newPassword && (
          <p className={errorTextStyle}>{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
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
          {...register("confirmPassword")}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className={errorTextStyle}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Display General Error or Success Message */}
      {error && <p className={generalErrorStyle}>{error}</p>}
      {successMessage && (
        <p className={successMessageStyle}>{successMessage}</p>
      )}

      <div className="text-right">
        <button
          type="submit"
          className={buttonStyle}
          disabled={
            isLoading ||
            !isDirty ||
            !!errors.currentPassword ||
            !!errors.newPassword ||
            !!errors.confirmPassword
          }
        >
          {isLoading ? "Saving..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
