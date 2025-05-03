import { AxiosError } from "axios";

// ----------------------------------------------AUTH-RELATED------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  newPassword: string;
}

export interface ResendEmailVerificationRequestWithMail {
  email: string;
}

export interface ResendEmailVerificationRequestWithToken {
  token: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface OauthProvidersResponseDto {
  providers: {
    google?: string;
    github?: string;
  };
}

// ------------------------------------------------USER-RELATED---------------------------------------

// Username Update Request Interface
export interface UsernameUpdateRequest {
  username: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

//----------------------------------------------ERROR-------------------------------------------------------

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  errorCode: number;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errorCode?: number;
  details?: {
    "Problem Detail :"?: ProblemDetail;
  };
  title?: string;
  timestamp: string;
}

export type AxiosApiError = AxiosError<ApiErrorResponse>;
