import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  ApiErrorResponse,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "../types/api";

// Determine Base URL based on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "http://localhost:8080/api" // Fallback, ensure NEXT_PUBLIC_API_BASE_URL_PROD is set
    : process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:8080/api"; // Fallback, ensure NEXT_PUBLIC_API_BASE_URL_DEV is set

console.log(`API Base URL: ${baseURL}`); // Log the base URL for debugging

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies if backend uses HttpOnly cookies for refresh tokens
});

// Request Interceptor: Add Authorization token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if running on the client side before accessing localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: AxiosError | Error | null) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if it's a 401 error, not a retry attempt, and not the refresh token endpoint itself
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token" &&
      typeof window !== "undefined" // Ensure we are on the client side
    ) {
      if (isRefreshing) {
        // If token is already being refreshed, queue the original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = "Bearer " + token;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err); // Propagate the error if refresh fails
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No refresh token available for refresh attempt.");
        // Optionally redirect to login or handle appropriately
        isRefreshing = false;
        processQueue(error, null); // Reject queued requests
        // Consider redirecting to login here
        // window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        console.log("Attempting token refresh...");
        const refreshData: RefreshTokenRequestDto = { refreshToken };
        const { data } = await axios.post<RefreshTokenResponseDto>(
          `${baseURL}/auth/refresh-token`,
          refreshData,
          { withCredentials: true } // Ensure cookies are sent if needed
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        console.log("Token refreshed successfully.");
        if (api.defaults.headers.common) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        }
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken); // Process queue with the new token
        isRefreshing = false;
        return api(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Optionally redirect to login
        // window.location.href = '/login';
        processQueue(refreshError as AxiosError, null); // Reject queue on refresh failure
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    } else if (error.response) {
      // Handle other API errors based on the defined structure
      console.error("API Error:", error.response.data);
      // You might want to throw a custom error object here
      // containing status, message, and errors field for UI handling
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Setup Error:", error.message);
    }

    // For errors not handled by refresh logic, just reject the promise
    // The actual error object (error.response?.data) can be caught in the service/component
    return Promise.reject(error);
  }
);

export default api;
