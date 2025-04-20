import { useContext, useEffect, useRef } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext"; // Adjust path as needed

// Enhanced logging function with timestamps and context
const log = {
  info: (context: string, message: string, data?: any) => {
    console.log(
      `[${new Date().toISOString()}] [useAuth:${context}] [INFO] ${message}`,
      data || ""
    );
  },
  warn: (context: string, message: string, data?: any) => {
    console.warn(
      `[${new Date().toISOString()}] [useAuth:${context}] [WARN] ${message}`,
      data || ""
    );
  },
  error: (context: string, message: string, data?: any) => {
    console.error(
      `[${new Date().toISOString()}] [useAuth:${context}] [ERROR] ${message}`,
      data || ""
    );
  },
  debug: (context: string, message: string, data?: any) => {
    console.debug(
      `[${new Date().toISOString()}] [useAuth:${context}] [DEBUG] ${message}`,
      data || ""
    );
  }
};

/**
 * Custom hook to access the authentication context.
 * Provides authentication status, user data, tokens, loading/error states,
 * and methods for login, logout, and signup.
 *
 * @throws Will throw an error if used outside of an AuthProvider.
 * @returns The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  // Track hook usage counts
  const hookUsageCount = useRef(0);
  
  // Track previous auth states to detect changes
  const prevAuthState = useRef<{
    isAuthenticated: boolean;
    isLoading: boolean;
    userId: string | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    userId: null
  });
  
  // Get the auth context
  const context = useContext(AuthContext);
  
  // Increment usage count on each render
  hookUsageCount.current += 1;
  
  // Log hook usage
  log.debug("hook", `useAuth hook called, usage count: ${hookUsageCount.current}`);
  
  if (context === undefined) {
    log.error("context", "useAuth hook used outside of AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Extract current state
  const { isAuthenticated, isLoading, user } = context;
  const userId = user?.id ? String(user.id) : null;
  
  // Compare with previous state and log meaningful changes
  useEffect(() => {
    const prev = prevAuthState.current;
    
    // Check for authentication state change
    if (prev.isAuthenticated !== isAuthenticated) {
      log.info("state", `Authentication state changed: ${prev.isAuthenticated} -> ${isAuthenticated}`);
    }
    
    // Check for loading state change
    if (prev.isLoading !== isLoading) {
      log.info("state", `Loading state changed: ${prev.isLoading} -> ${isLoading}`);
    }
    
    // Check for user ID change
    if (prev.userId !== userId) {
      log.info("state", `User changed: ${prev.userId || 'null'} -> ${userId || 'null'}`);
    }
    
    // Update reference to current state
    prevAuthState.current = {
      isAuthenticated,
      isLoading,
      userId
    };
  }, [isAuthenticated, isLoading, userId]);
  
  // Log when a component unmounts while using this hook
  useEffect(() => {
    return () => {
      log.debug("lifecycle", "Component using useAuth is unmounting");
    };
  }, []);
  
  // Return the enhanced context with additional tracking
  return {
    ...context,
    login: async (data) => {
      log.info("action", "login called", { email: data.email });
      await context.login(data);
    },
    logout: async () => {
      log.info("action", "logout called");
      await context.logout();
    },
    signup: async (data) => {
      log.info("action", "signup called", { email: data.email });
      await context.signup(data);
    },
    refreshUserProfile: async () => {
      log.info("action", "refreshUserProfile called");
      await context.refreshUserProfile();
    },
    updateLocalUser: (updatedUser) => {
      log.info("action", "updateLocalUser called", { userId: updatedUser.id });
      context.updateLocalUser(updatedUser);
    },
    clearError: () => {
      log.info("action", "clearError called");
      context.clearError();
    }
  };
};