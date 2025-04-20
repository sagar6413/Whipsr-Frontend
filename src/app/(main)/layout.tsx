"use client";

import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext"; // Removed AuthContextType
import { useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar"; // Adjust path

// Simple Spinner
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext); // Use context

  if (!authContext) {
    // Or redirect to an error page / login page immediately
    throw new Error("MainLayout must be used within an AuthProvider");
  }

  const { isAuthenticated, isLoading } = authContext; // Get state from context
  const router = useRouter();

  useEffect(() => {
    // Redirect ONLY if loading is complete AND the user is definitively not authenticated.
    if (!isLoading && !isAuthenticated) {
      console.log(
        "MainLayout: Not authenticated after load, redirecting to login."
      );
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loader while isLoading is true.
  // This covers both initial auth check and subsequent loading states.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If loading is finished and user is authenticated, render the layout.
  // If loading is finished and user is not authenticated, the useEffect will redirect.
  // We might briefly render null or a spinner just before the redirect happens.
  return (
    <>
      {isAuthenticated ? (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          {/* You can add a Footer component here */}
        </div>
      ) : (
        // Render spinner while the redirect effect is processing
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
