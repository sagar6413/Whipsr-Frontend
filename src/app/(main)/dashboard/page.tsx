"use client";

import React from "react";
import { useUser } from "../../../hooks/useUser"; // Adjust path

// Simple Spinner
const Spinner = () => (
  <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
);

const DashboardPage: React.FC = () => {
  // Only get user, as layout handles auth check
  const { user } = useUser();

  // Note: The layout already handles loading and redirecting if not authenticated
  // So we can assume user exists if this component renders

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
      {/* Check user just in case, though layout should prevent rendering without it */}
      {user ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700">
            Welcome back, <span className="font-medium">{user.username}</span>!
          </p>
          <p className="text-gray-600 text-sm mt-2">Your email: {user.email}</p>
          {/* Add dashboard content here */}
        </div>
      ) : (
        // Should ideally not be reached if layout protection works
        <div className="flex justify-center items-center p-10">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
