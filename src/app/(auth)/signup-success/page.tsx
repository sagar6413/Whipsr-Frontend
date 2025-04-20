"use client";

import React from "react";
import Link from "next/link";
import AuthForm from "../../../components/auth/AuthForm"; // Adjust path if needed

const SignupSuccessPage: React.FC = () => {
  return (
    <AuthForm
      title="Signup Successful!"
      description="Please check your inbox to verify your email address."
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          An email has been sent to the address you provided. Click the link in
          the email to complete your registration.
        </p>
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Login
        </Link>
      </div>
    </AuthForm>
  );
};

export default SignupSuccessPage;
