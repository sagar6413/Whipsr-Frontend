import api from "./api";
import {
  AuthResponse,
  AxiosApiError,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
  OauthProvidersResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  ResetPasswordRequestDto,
  SignupRequestDto,
  SignupApiResponse,
} from "../types/api";

/**
 * Registers a new user.
 * @param data - Registration data (email, password, confirmPassword)
 * @returns Promise resolving with user object and tokens in AuthResponse format
 */
export const signup = async (data: SignupRequestDto): Promise<AuthResponse> => {
  try {
    // Expect the full API response structure
    const response = await api.post<SignupApiResponse>("/auth/signup", data);

    // Check if the signup was successful according to the API
    if (response.data.success && response.data.data) {
      const responseData = response.data.data;
      // Construct the AuthResponse object expected by AuthContext
      const authResponse: AuthResponse = {
        user: responseData.user,
        tokens: {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken,
          tokenType: responseData.tokenType,
          expiresIn: responseData.expiresIn,
        },
      };
      return authResponse;
    } else {
      // Throw an error if the API indicates failure or data is missing
      throw new Error(
        response.data.message || "Signup failed: Invalid API response"
      );
    }
  } catch (error) {
    console.error(
      "Signup failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Logs in a user.
 * @param data - Login data (email, password)
 * @returns Promise resolving with user object and tokens
 */
export const login = async (data: LoginRequestDto): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", data);
    // Assuming the response contains tokens, store them upon successful login
    if (response.data.tokens && typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.tokens.accessToken);
      localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Verifies a user's email using a token.
 * @param token - The verification token from the email link.
 * @returns Promise resolving with a success message (or potentially user info).
 */
export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  try {
    console.log("Verifying email:", token);
    // The guide specifies a GET request with a query parameter
    const response = await api.get<{ message: string }>("/auth/verify-email", {
      params: { token },
    });
    console.log("Email verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Email verification failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Requests a password reset email.
 * @param data - Object containing the user's email.
 * @returns Promise resolving with a success message.
 */
export const requestPasswordReset = async (
  data: ForgotPasswordRequestDto
): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Password reset request failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Resets the user's password using a token.
 * @param data - Object containing the token, new password, and confirmation.
 * @returns Promise resolving with a success message.
 */
export const resetPassword = async (
  data: ResetPasswordRequestDto
): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Password reset failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Explicitly refreshes the access token using the refresh token.
 * Note: Interceptor handles automatic refresh, but this allows manual refresh if needed.
 * @param data - Object containing the refresh token.
 * @returns Promise resolving with the new access token.
 */
export const refreshToken = async (
  data: RefreshTokenRequestDto
): Promise<RefreshTokenResponseDto> => {
  try {
    const response = await api.post<RefreshTokenResponseDto>(
      "/auth/refresh-token",
      data
    );
    // Store the new access token
    if (response.data.accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Token refresh failed:",
      (error as AxiosApiError).response?.data || error
    );
    // Clear tokens on explicit refresh failure as well?
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Consider redirecting to login here
    }
    throw error;
  }
};

/**
 * Logs out the user.
 * This typically involves telling the backend to invalidate the refresh token
 * and clearing local tokens.
 * @param data - Object containing the refresh token to invalidate.
 * @returns Promise resolving with a success message.
 */
export const logout = async (
  data: LogoutRequestDto
): Promise<{ message: string }> => {
  try {
    // Call the backend logout endpoint (if it exists and requires the refresh token)
    const response = await api.post<{ message: string }>("/auth/logout", data);

    // Always clear local tokens regardless of backend response for frontend logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    console.log("Logout successful, tokens cleared.");
    return response.data;
  } catch (error) {
    // Log error, but still clear local tokens as a safety measure
    console.error(
      "Logout API call failed:",
      (error as AxiosApiError).response?.data || error
    );
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    // Re-throw the error in case the caller wants to handle backend logout failure specifically
    throw error;
  }
};

/**
 * Retrieves the available OAuth2 provider URLs.
 * @returns Promise resolving with an object containing provider URLs.
 */
export const getOauthProviders =
  async (): Promise<OauthProvidersResponseDto> => {
    try {
      const response = await api.get<OauthProvidersResponseDto>(
        "/auth/oauth2-providers"
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get OAuth providers:",
        (error as AxiosApiError).response?.data || error
      );
      throw error;
    }
  };

/**
 * Requests a new email verification link.
 * The backend endpoint for this is not specified in the guide, assuming POST /auth/resend-verification
 * @param email - The email address to resend the verification to.
 * @returns Promise resolving with a success message.
 */
export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  try {
    // TODO: Update endpoint if different
    const response = await api.post<{ message: string }>(
      "/auth/resend-verification",
      { email }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Resend verification email failed:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};
