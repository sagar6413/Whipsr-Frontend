"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getCurrentUserProfile } from "../../../services/userService";
import { User, AxiosApiError } from "../../../types/api";
import UpdateUsernameForm from "../../../components/profile/UpdateUsernameForm";
import ChangePasswordForm from "../../../components/profile/ChangePasswordForm";
import DeleteAccountSection from "../../../components/profile/DeleteAccountSection";

// Simple Loading Spinner
const Spinner = () => (
  <div className="border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-blue-600" />
);

const formatProfileDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

const ProfilePage: React.FC = () => {
  console.log("🔄 ProfilePage rendered");
  
  // Use useContext to access the AuthContext value
  const authContext = useContext(AuthContext);
  console.log("📊 AuthContext state:", { 
    hasAuthUser: !!authContext?.user, 
    authLoading: authContext?.isLoading,
    hasAuthError: !!authContext?.error
  });

  // Add a check for undefined context
  if (!authContext) {
    console.error("❌ AuthContext is undefined!");
    throw new Error("ProfilePage must be used within an AuthProvider");
  }

  const {
    user: authUser,
    isLoading: authLoading,
    error: authError,
  } = authContext;

  // Create a ref to track component mounts
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  console.log(`📈 Render count: ${renderCountRef.current}`);

  const [profileUser, setProfileUser] = useState<User | null>(authUser);
  const [isLoading, setIsLoading] = useState<boolean>(!authUser && authLoading);
  const [error, setError] = useState<string | null>(
    authError ? authError.message : null
  );

  // Use a ref instead of state to track fetch attempts
  // This helps avoid re-renders that could trigger the effect again
  const hasAttemptedFetchRef = useRef<boolean>(false);
  
  console.log("📊 Current component state:", { 
    hasProfileUser: !!profileUser, 
    isLoading, 
    hasError: !!error,
    hasAttemptedFetch: hasAttemptedFetchRef.current
  });

  useEffect(() => {
    console.log("🔍 useEffect running with dependencies:", { 
      hasAuthUser: !!authUser, 
      authLoading, 
      hasAttemptedFetch: hasAttemptedFetchRef.current 
    });
    
    // Update state when auth context changes
    if (authUser) {
      console.log("✅ Auth user present, using auth user data");
      setProfileUser(authUser);
      setIsLoading(false);
      setError(null);
    } else if (!authLoading && !hasAttemptedFetchRef.current) {
      // Only fetch if auth is done loading and we haven't tried fetching yet
      console.log("🔄 Auth user not available, fetching profile data");
      setIsLoading(true);
      hasAttemptedFetchRef.current = true; // Mark that we've attempted a fetch
      
      getCurrentUserProfile()
        .then((data: User) => {
          console.log("✅ Profile data fetched successfully", data);
          setProfileUser(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const axiosError = err as AxiosApiError;
          const errorMessage = axiosError.response?.data?.message || "Failed to load profile.";
          console.error("❌ Error fetching profile:", errorMessage);
          setError(errorMessage);
          setProfileUser(null);
        })
        .finally(() => {
          console.log("🏁 Profile fetch request complete");
          setIsLoading(false);
        });
    } else {
      console.log("ℹ️ Skipping profile fetch:", {
        reason: authLoading 
          ? "Auth still loading" 
          : "Already attempted fetch"
      });
    }
  }, [authUser, authLoading]); // Removed hasAttemptedFetch from dependencies

  // Additional cleanup and tracking effect
  useEffect(() => {
    console.log("🚀 Component mounted");
    
    return () => {
      console.log("👋 Component unmounted");
    };
  }, []);

  console.log("🎬 Rendering UI based on state:", { 
    isLoading, 
    hasError: !!error, 
    hasProfileUser: !!profileUser 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error && !profileUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>Error loading profile: {error}</p>
        {/* Add a retry button here if needed */}
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Not logged in. Please log in to view your profile.</p>
        {/* Add a link to login page here */}
      </div>
    );
  }

  // Display Profile Information
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>

        {/* Profile Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileUser.username}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileUser.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  First Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileUser.firstName || "N/A"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileUser.lastName || "N/A"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Roles</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileUser.roles.join(", ")}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email Verified
                </dt>
                <dd
                  className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                    profileUser.emailVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {profileUser.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Login
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatProfileDate(profileUser.lastLoginAt)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Account Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatProfileDate(profileUser.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Update Username Section */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <UpdateUsernameForm currentUsername={profileUser.username} />
          </div>
        </div>

        {/* Security Settings Section */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Security Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your password and account deletion.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
            {/* Change Password Form */}
            <ChangePasswordForm />

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Delete Account Section */}
            <DeleteAccountSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;