import { log } from "@/utils/logger";
import {
  LoginRequest,
  OauthProvidersResponseDto,
  PasswordResetRequest,
  PasswordUpdateRequest,
  ResendVerificationRequest,
  SignupRequest,
  Tokens
} from "../types/types";
import api from "./axiosInstance";

export const signupApi = async (data: SignupRequest): Promise<void> => {
  log.debug("signup", "Starting signup request", { email: data.email });
  const response = await api.post<void>("/auth/signup", data);
  log.info("signup", "Signup successful", { email: data.email });
  return response.data;
};

export const login = async (data: LoginRequest): Promise<Tokens> => {
  log.debug("login", "Starting login request", { email: data.email });
  const response = await api.post<Tokens>("/auth/login", data);
  log.info("login", "Login successful", { email: data.email });
  return response.data;
};

export const verifyEmail = async (token: string): Promise<void> => {
  log.debug("verifyEmail", "Starting email verification");
  const response = await api.get<void>("/auth/verify-email", { params: { token } });
  log.info("verifyEmail", "Email verification complete");
  return response.data;
};

export const forgotPassword = async (data: PasswordResetRequest): Promise<void> => {
  log.debug("forgotPassword", "Sending forgot password link", { email: data.email });
  const response = await api.post<void>("/auth/forgot-password", data);
  log.info("forgotPassword", "Forgot Password Email Sent Successfully");
  return response.data;
};

export const resetPassword = async (data: PasswordUpdateRequest): Promise<void> => {
  log.debug("resetPassword", "Resetting password with token");
  const response = await api.post<void>("/auth/reset-password", data);
  log.info("resetPassword", "Password reset successful");
  return response.data;
};

export const logout = async (): Promise<void> => {
  log.debug("logout", "Starting logout process");
  const response = await api.post<void>("/auth/logout");
  log.info("logout", "Logout successful");
  return response.data;
};

export const getOauthProviders = async (): Promise<OauthProvidersResponseDto> => {
  log.debug("getOauthProviders", "Fetching OAuth providers");
  const response = await api.get<OauthProvidersResponseDto>("/auth/oauth2-providers");
  log.info("getOauthProviders", "OAuth providers retrieved successfully");
  return response.data;
};

export const resendVerificationEmail = async (data: ResendVerificationRequest): Promise<void> => {
  log.debug("resendVerificationEmail", "Requesting new verification email");
  const response = await api.post<void>("/auth/resend-verification", data);
  log.info("resendVerificationEmail", "Verification email request sent");
  return response.data;
};