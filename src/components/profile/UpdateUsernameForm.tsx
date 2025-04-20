"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUsernameSchema,
  UpdateUsernameInput,
} from "../../lib/validators/authValidators"; // Adjust path
import { updateUsername } from "../../services/userService"; // Adjust path
import { useAuth } from "../../hooks/useAuth"; // Adjust path
import { AxiosApiError } from "../../types/api"; // Adjust path

interface UpdateUsernameFormProps {
  currentUsername: string;
}

const UpdateUsernameForm: React.FC<UpdateUsernameFormProps> = ({
  currentUsername,
}) => {
  const { updateLocalUser, user } = useAuth(); // Use updateLocalUser from context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // Track if the form has been changed
    setError: setFormError,
    reset, // To reset form state
    watch, // watch is correctly destructured here
  } = useForm<UpdateUsernameInput>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: currentUsername || "",
    },
  });

  // Reset form when currentUsername changes (e.g., after successful update)
  useEffect(() => {
    reset({ username: currentUsername || "" });
  }, [currentUsername, reset]);

  // Clear messages when component unmounts or user changes
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, [user]);

  const onSubmit: SubmitHandler<UpdateUsernameInput> = async (data) => {
    if (data.username === currentUsername) {
      setError("New username must be different from the current one.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updatedUser = await updateUsername(data);
      updateLocalUser(updatedUser); // Update user state in context
      setSuccessMessage("Username updated successfully!");
      reset({ username: updatedUser.username }); // Reset form with new username
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const axiosError = err as AxiosApiError;
      const apiError = axiosError.response?.data;
      if (apiError?.errors) {
        apiError.errors.forEach((e) => {
          if (e.field === "username") {
            setFormError("username", { type: "manual", message: e.message });
          }
        });
        setError("Please correct the error above.");
      } else {
        setError(apiError?.message || "An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Common styles (Consider moving to a shared location)
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
        Update Username
      </h3>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          New Username
        </label>
        <div className="mt-1">
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            className={`${inputStyle} ${
              errors.username ? "border-red-500" : ""
            }`}
            {...register("username")}
            disabled={isLoading}
          />
        </div>
        {errors.username && (
          <p className={errorTextStyle}>{errors.username.message}</p>
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
            !!errors.username ||
            currentUsername === watch("username")
          }
        >
          {isLoading ? "Saving..." : "Save Username"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUsernameForm;
