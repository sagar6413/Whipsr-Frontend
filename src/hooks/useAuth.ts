import {
  login,
  signupApi,
  logout,
  verifyEmail,
  resetPassword,
  getOauthProviders,
  resendVerificationEmail,
  forgotPassword,
} from "@/services/authService";
import { useUserStore } from "@/store/userStore";
import {
  LoginRequest,
  SignupRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
  ResendVerificationRequest,
  OauthProvidersResponseDto,
} from "@/types/types";
import { setTokens, clearTokens, isAuthenticated } from "@/utils/cookieManager";
import { log } from "@/utils/logger";
import Router from "next/router";
import { useState, useCallback } from "react";
import { isAxiosApiError } from "@/services/axiosInstance";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser, clearUser } = useUserStore();

  const handleError = useCallback((functionName: string, error: unknown) => {
    const errorMessage = isAxiosApiError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
      ? error.message
      : "An unknown error occurred";

    log.error(
      `useAuth.${functionName}`,
      "Operation failed",
      isAxiosApiError(error) ? error.response?.data : error
    );

    setError(errorMessage);
    return false;
  }, []);

  const signin = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.signin", "Starting signin process", {
        email: data.email,
      });

      try {
        console.log("Before login isAuthenticated()", isAuthenticated());
        const response = await login(data);
        setTokens(response.accessToken, response.refreshToken);
        console.log("After login", isAuthenticated());
        await fetchUser();
        log.info("useAuth.signin", "User authenticated successfully");

        return true;
      } catch (err) {
        return handleError("signin", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, handleError]
  );

  const signup = useCallback(
    async (data: SignupRequest) => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.signup", "Starting signup process", {
        email: data.email,
      });

      try {
        await signupApi(data);
        return true;
      } catch (err) {
        return handleError("signup", err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const signout = useCallback(async () => {
    setLoading(true);
    setError(null);
    log.debug("useAuth.signout", "Starting logout process");

    try {
      await logout();
      clearTokens();
      clearUser();

      Router.push("/login");
      return true;
    } catch (err) {
      return handleError("signout", err);
    } finally {
      setLoading(false);
    }
  }, [clearUser, handleError]);

  const verify = useCallback(
    async (token: string) => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.verify", "Starting email verification");

      try {
        await verifyEmail(token);
        return true;
      } catch (err) {
        Router.push("/verification-failed");
        return handleError("verify", err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const forgotPasswordRequest = useCallback(
    async (data: PasswordResetRequest) => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.forgotPasswordRequest", "Requesting password reset", {
        email: data.email,
      });

      try {
        await forgotPassword(data);
        return true;
      } catch (err) {
        return handleError("forgotPasswordRequest", err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const resetPasswordWithToken = useCallback(
    async (data: PasswordUpdateRequest) => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.resetPasswordWithToken", "Resetting password");

      try {
        await resetPassword(data);
        return true;
      } catch (err) {
        return handleError("resetPasswordWithToken", err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const resendVerification = useCallback(
    async (data: ResendVerificationRequest) => {
      setLoading(true);
      setError(null);
      log.debug(
        "useAuth.resendVerification",
        "Requesting new verification email"
      );

      try {
        await resendVerificationEmail(data);
        return true;
      } catch (err) {
        return handleError("resendVerification", err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getOAuthProviders =
    useCallback(async (): Promise<OauthProvidersResponseDto | null> => {
      setLoading(true);
      setError(null);
      log.debug("useAuth.getOAuthProviders", "Fetching OAuth providers");

      try {
        const providers = await getOauthProviders();
        return providers;
      } catch (err) {
        handleError("getOAuthProviders", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, [handleError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    signin,
    signup,
    signout,
    verify,
    forgotPasswordRequest,
    resetPasswordWithToken,
    resendVerification,
    getOAuthProviders,
    clearError,
    loading,
    error,
  };
};
