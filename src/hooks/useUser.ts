import { useAuth } from "./useAuth";
import { User } from "../types/api"; // Adjust path as needed
import { useRef, useEffect } from "react";

// Define a type for log data to replace 'any'
type LogData = unknown;

// Enhanced logging function with timestamps and context
const log = {
  info: (context: string, message: string, data?: LogData) => {
    console.log(
      `[${new Date().toISOString()}] [useUser:${context}] [INFO] ${message}`,
      data || ""
    );
  },
  warn: (context: string, message: string, data?: LogData) => {
    console.warn(
      `[${new Date().toISOString()}] [useUser:${context}] [WARN] ${message}`,
      data || ""
    );
  },
  error: (context: string, message: string, data?: LogData) => {
    console.error(
      `[${new Date().toISOString()}] [useUser:${context}] [ERROR] ${message}`,
      data || ""
    );
  },
  debug: (context: string, message: string, data?: LogData) => {
    console.debug(
      `[${new Date().toISOString()}] [useUser:${context}] [DEBUG] ${message}`,
      data || ""
    );
  }
};

/**
 * Custom hook to access user-specific data from the authentication context.
 * Provides the user object and the authentication status.
 *
 * @returns An object containing the user and isAuthenticated status.
 */
export const useUser = (): { user: User | null; isAuthenticated: boolean } => {
  // Track hook usage counts
  const hookUsageCount = useRef(0);

  // Track component identity to detect potential multiple instances
  const componentId = useRef(`user-hook-${Math.random().toString(36).substring(2, 9)}`);

  // Track previous values to detect changes
  const prevValues = useRef<{
    isAuthenticated: boolean;
    userId: string | null;
  }>({
    isAuthenticated: false,
    userId: null
  });

  // Get auth data from the parent hook
  const { user, isAuthenticated } = useAuth();

  // Increment usage count on each render
  hookUsageCount.current += 1;

  // Log hook usage
  log.debug("hook", `useUser hook called, usage count: ${hookUsageCount.current}, component ID: ${componentId.current}`);

  // Log when user data changes
  useEffect(() => {
    const userId = user?.id ? String(user.id) : null;
    const prev = prevValues.current;

    // Check for authentication state change
    if (prev.isAuthenticated !== isAuthenticated) {
      log.info("state", `Authentication state changed: ${prev.isAuthenticated} -> ${isAuthenticated}`);
    }

    // Check for user ID change
    if (prev.userId !== userId) {
      log.info("state", `User changed: ${prev.userId || 'null'} -> ${userId || 'null'}`);

      // Log detailed user info on change
      if (user) {
        log.debug("user", "User data details", {
          id: user.id,
          email: user.email,
          // Include other user properties you want to monitor
          // but don't log sensitive info
        });
      }
    }

    // Update reference to current values
    prevValues.current = {
      isAuthenticated,
      userId: userId
    };
  }, [user, isAuthenticated]);

  // Log when a component unmounts while using this hook
  useEffect(() => {
    const currentComponentId = componentId.current; // Copy the current value to a local variable
    return () => {
      log.debug("lifecycle", `Component using useUser is unmounting, component ID: ${currentComponentId}`);
    };
  }, []);

  return { user, isAuthenticated };
};