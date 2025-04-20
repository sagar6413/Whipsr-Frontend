import { AxiosError } from "axios";

// Common Error Structure
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
  timestamp?: string; // Optional as per guide example, but good practice
  path?: string; // Optional as per guide example
}

// Extend AxiosError to include our custom error response data
// Use a type alias instead of an empty interface
export type AxiosApiError = AxiosError<ApiErrorResponse>;

// User Object Structure
export interface User {
  id: string | number; // ID can be number based on response
  email: string;
  username: string;
  firstName?: string; // Make optional if not always present initially
  lastName?: string; // Make optional if not always present initially
  roles: string[]; // Changed from role: string
  emailVerified: boolean;
  lastLoginAt?: string; // Added
  createdAt: string;
  avatarUrl: string;
  // updatedAt: string; // Removed based on new response
}

// New type for the wrapped user profile response
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
  timestamp: string;
}

// Token Structure (assuming this is part of the login/signup response)
export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string; // Optional, based on your example
  expiresIn?: number; // Optional, based on your example
}

// Original structure expected by AuthContext
export interface AuthResponse {
  user: User;
  tokens: Tokens; // Use the updated Tokens interface
}

// --- New Type for Actual Signup API Response ---
export interface SignupApiResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface SignupApiResponse {
  success: boolean;
  message: string;
  data: SignupApiResponseData;
  timestamp: string;
}
// --- End New Type ---

// Registration
export interface SignupRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Login
export interface LoginRequestDto {
  email: string;
  password: string;
}

// Email Verification (No DTO, uses query param)

// Password Reset Request
export interface ForgotPasswordRequestDto {
  email: string;
}

// Password Reset
export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Token Refresh
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

// Logout
export interface LogoutRequestDto {
  refreshToken: string;
}

// OAuth2 Providers
export interface OauthProvidersResponseDto {
  providers: {
    google?: string; // Optional based on backend implementation
    github?: string; // Optional based on backend implementation
    // Add other providers as needed
  };
}

// Username Update
export interface UpdateUsernameRequestDto {
  username: string;
}

// Password Change (Assuming endpoint and DTO structure)
export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Account Deletion (No DTO usually needed for DELETE)
