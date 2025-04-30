"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"; // Adjust path
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/cookieManager";

// Simple Spinner
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
);

export default function AuthLayout({
  children,
}: {
  // Use React.PropsWithChildren or define type inline
  children: React.ReactNode;
}) {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If finished loading and user IS authenticated, redirect from auth pages
    if (!loading && isAuthenticated()) {
      router.push("/chat"); // Or your main protected route
    }
  }, [loading, router]);

  // Show loader while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If not loading and not authenticated, render the auth page (login/signup)
  // If not loading and authenticated, the useEffect above will trigger redirect
  return <>{!isAuthenticated ? children : null}</>;
}
