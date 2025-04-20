"use client";

import React, { ReactNode } from "react";

interface AuthFormProps {
  title: string;
  description?: string; // Optional description
  children: ReactNode; // The form fields and submit button
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // Form submission handler
  errorMessage?: string | null; // Optional error message to display
  isLoading?: boolean; // Optional loading state for disabling form/button
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  description,
  children,
  onSubmit,
  errorMessage,
  isLoading = false,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-lg">
        <div>
          {/* You might want to add a logo here */}
          {/* <img className="mx-auto h-12 w-auto" src="/logo.svg" alt="Workflow" /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
          {/* Display general form error */}
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {/* Render form fields and submit button passed as children */}
          <fieldset disabled={isLoading} className="space-y-6">
            {children}
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
