"use client"; // Mark as client component

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import * as authService from "../services/authService";
import api from "../services/api"; // Import api to reset headers on logout
import {
  User,
  Tokens,
  LoginRequestDto,
  SignupRequestDto,
  ApiErrorResponse,
  AxiosApiError,
  UserProfileResponse,
} from "../types/api";

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiErrorResponse | null;
}

// Define the shape of the context value
// Re-export the type just in case
export interface AuthContextType extends AuthState {
  login: (data: LoginRequestDto) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupRequestDto) => Promise<void>;
  clearError: () => void;
  refreshUserProfile: () => Promise<void>;
  updateLocalUser: (user: User) => void;
}

// Create the context with a default undefined value
// Consumers must be wrapped in a provider
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define a type for log data to replace 'any'
type LogData = unknown;

// Enhanced logging function with timestamps and context
const log = {
  info: (context: string, message: string, data?: LogData) => {
    console.log(
      `[${new Date().toISOString()}] [AuthContext:${context}] [INFO] ${message}`,
      data || ""
    );
  },
  warn: (context: string, message: string, data?: LogData) => {
    console.warn(
      `[${new Date().toISOString()}] [AuthContext:${context}] [WARN] ${message}`,
      data || ""
    );
  },
  error: (context: string, message: string, data?: LogData) => {
    console.error(
      `[${new Date().toISOString()}] [AuthContext:${context}] [ERROR] ${message}`,
      data || ""
    );
  },
  debug: (context: string, message: string, data?: LogData) => {
    console.debug(
      `[${new Date().toISOString()}] [AuthContext:${context}] [DEBUG] ${message}`,
      data || ""
    );
  },
};

// Define props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Track render counts to detect infinite loops
  const renderCount = useRef(0);
  const effectRunCount = useRef(0);

  // Track state changes
  const prevUser = useRef<User | null>(null);
  const prevTokens = useRef<Tokens | null>(null);
  const prevIsLoading = useRef<boolean>(true);

  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading until initial check is done
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  // Track initialization state
  const isInitialized = useRef(false);

  // Log render
  renderCount.current += 1;
  log.debug("render", `Render count: ${renderCount.current}`);

  // Log state changes
  useEffect(() => {
    if (prevUser.current !== user) {
      log.debug("state", `User state changed`, {
        before: prevUser.current ? `ID: ${prevUser.current.id}` : "null",
        after: user ? `ID: ${user.id}` : "null",
      });
      prevUser.current = user;
    }

    if (prevTokens.current !== tokens) {
      log.debug("state", `Tokens state changed`, {
        before: prevTokens.current ? "exists" : "null",
        after: tokens ? "exists" : "null",
      });
      prevTokens.current = tokens;
    }

    if (prevIsLoading.current !== isLoading) {
      log.debug(
        "state",
        `isLoading state changed: ${prevIsLoading.current} -> ${isLoading}`
      );
      prevIsLoading.current = isLoading;
    }
  });

  const clearError = () => {
    log.debug("clearError", "Clearing error state");
    setError(null);
  };

  // Wrap handleLogout in useCallback to ensure stable identity
  const handleLogout = useCallback(async () => {
    log.info("logout", "Starting logout process");
    setIsLoading(true);
    setError(null);
    const currentRefreshToken =
      tokens?.refreshToken || localStorage.getItem("refreshToken");

    if (currentRefreshToken) {
      log.debug("logout", "Found refresh token, attempting backend logout");
      try {
        await authService.logout({ refreshToken: currentRefreshToken });
        log.info("logout", "Backend logout successful");
      } catch (err) {
        const apiError = err as AxiosApiError;
        log.error(
          "logout",
          "Backend logout failed, proceeding with client-side cleanup",
          {
            status: apiError.response?.status,
            message: apiError.response?.data?.message,
          }
        );
        setError(
          apiError.response?.data || {
            status: 500,
            message: "Logout failed on server, cleaned up locally.",
          }
        );
      }
    } else {
      log.debug("logout", "No refresh token found, skipping backend logout");
    }

    // Always clear client-side state and storage
    log.debug("logout", "Clearing authentication state and local storage");
    setUser(null);
    setTokens(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    log.info("logout", "Client-side logout cleanup complete");
    setIsLoading(false);
  }, [tokens]); // Only depend on tokens state

  // Function to fetch user profile (e.g., /users/me)
  const fetchUserProfile = useCallback(async () => {
    log.info("fetchUserProfile", "Starting user profile fetch");
    try {
      // Check if we have an access token in the header
      const authHeader = api.defaults.headers.common["Authorization"];
      log.debug(
        "fetchUserProfile",
        `Authorization header present: ${!!authHeader}`
      );

      // Expect the wrapped response
      const response = await api.get<UserProfileResponse>("/users/me");
      if (response.data && response.data.success) {
        log.info("fetchUserProfile", "User profile fetched successfully", {
          userId: response.data.data?.id,
          email: response.data.data?.email,
        });
        setUser(response.data.data); // Set user from the nested data field
        setError(null);
        return true; // Return success indicator
      } else {
        log.error("fetchUserProfile", "API indicated failure", {
          message: response.data?.message,
        });
        return false; // Return failure indicator
      }
    } catch (err) {
      const apiError = err as AxiosApiError;
      log.error("fetchUserProfile", "Network/Auth error", {
        status: apiError.response?.status,
        message: apiError.response?.data?.message,
        error: err,
      });
      return false; // Return failure indicator
    }
  }, []); // No dependencies, handleLogout will be called separately

  // Check authentication status on initial load
  useEffect(() => {
    effectRunCount.current += 1;
    log.info("initializeAuth", `Effect run count: ${effectRunCount.current}`);

    // Guard against multiple initializations
    if (isInitialized.current) {
      log.warn(
        "initializeAuth",
        "Auth already initialized, skipping initialization"
      );
      return;
    }

    const initializeAuth = async () => {
      log.info("initializeAuth", "Starting authentication initialization");
      setIsLoading(true);
      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        log.debug(
          "initializeAuth",
          `Access token exists: ${!!storedAccessToken}, Refresh token exists: ${!!storedRefreshToken}`
        );

        if (storedAccessToken && storedRefreshToken) {
          log.info("initializeAuth", "Tokens found, setting up auth state");
          setTokens({
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
          });

          // Set auth header for API calls
          log.debug("initializeAuth", "Setting Authorization header");
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedAccessToken}`;

          log.info("initializeAuth", "Attempting to fetch user profile");
          const profileSuccess = await fetchUserProfile();

          if (!profileSuccess) {
            log.warn(
              "initializeAuth",
              "Failed to fetch profile, performing logout"
            );
            await handleLogout();
          } else {
            log.info(
              "initializeAuth",
              "Authentication initialization completed successfully"
            );
          }
        } else {
          log.info(
            "initializeAuth",
            "No tokens found, user is not authenticated"
          );
        }
      } catch (err) {
        log.error(
          "initializeAuth",
          "Initialization error, performing logout",
          err
        );
        await handleLogout();
      } finally {
        isInitialized.current = true;
        log.info("initializeAuth", "Setting isLoading to false");
        setIsLoading(false); // Always set loading to false when initialization is complete
      }
    };

    initializeAuth();

    // Return empty cleanup function to satisfy hook rules
    return () => {
      log.debug("initializeAuth", "Effect cleanup function called");
    };
  }, [fetchUserProfile, handleLogout]); // Include both functions in dependencies

  const handleLogin = async (data: LoginRequestDto) => {
    log.info("login", "Starting login process", { email: data.email });
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      log.info("login", "Login API call successful", {
        userId: response.user?.id,
      });

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);

      // Update state
      log.debug("login", "Setting user and tokens state");
      setUser(response.user);
      setTokens(response.tokens);

      // Set default header for subsequent requests
      log.debug("login", "Setting Authorization header");
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.tokens.accessToken}`;
    } catch (err) {
      const apiError = err as AxiosApiError;
      log.error("login", "Login failed", {
        status: apiError.response?.status,
        message: apiError.response?.data?.message,
      });
      setError(
        apiError.response?.data || {
          status: 500,
          message: "Login failed. Please try again.",
        }
      );
      // Ensure user/tokens are null on login failure
      setUser(null);
      setTokens(null);
    } finally {
      log.info("login", "Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupRequestDto) => {
    log.info("signup", "Starting signup process", { email: data.email });
    setIsLoading(true);
    setError(null);
    try {
      // Call the signup service function
      await authService.signup(data);
      log.info(
        "signup",
        "Signup API call successful. User needs to verify email."
      );
      // No state changes here, user remains logged out.
    } catch (err) {
      const apiError = err as AxiosApiError;
      log.error("signup", "Signup failed", {
        status: apiError.response?.status,
        message: apiError.response?.data?.message,
      });
      setError(
        apiError.response?.data || {
          status: 500,
          message: "Signup failed. Please try again.",
        }
      );
      // Re-throw the error so the calling component's catch block can handle it if needed
      throw err;
    } finally {
      log.info("signup", "Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    log.info("refreshUserProfile", "Starting user profile refresh");
    setIsLoading(true);
    try {
      const profileSuccess = await fetchUserProfile();
      if (!profileSuccess) {
        log.warn(
          "refreshUserProfile",
          "Failed to refresh profile, performing logout"
        );
        await handleLogout();
      } else {
        log.info("refreshUserProfile", "Profile refreshed successfully");
      }
    } catch (err) {
      log.error(
        "refreshUserProfile",
        "Error refreshing profile, performing logout",
        err
      );
      await handleLogout();
    } finally {
      log.info("refreshUserProfile", "Setting isLoading to false");
      setIsLoading(false); // Always set loading to false when done
    }
  };

  const updateLocalUser = (updatedUser: User) => {
    log.info("updateLocalUser", "Updating local user data", {
      userId: updatedUser.id,
      email: updatedUser.email,
    });
    setUser(updatedUser);
  };

  // Compute isAuthenticated value
  const isAuthenticated = !!user && !!tokens;

  // Log authentication state when it changes
  useEffect(() => {
    log.info(
      "authState",
      `Authentication state: ${
        isAuthenticated ? "Authenticated" : "Not Authenticated"
      }`
    );
  }, [isAuthenticated]);

  const contextValue: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
    clearError,
    refreshUserProfile,
    updateLocalUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
