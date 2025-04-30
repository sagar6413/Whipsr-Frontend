import { AxiosApiError, Tokens } from "@/types/types";
import { getAccessToken, getRefreshToken, setTokens } from "@/utils/cookieManager";
import { log } from "@/utils/logger";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Determine API base URL based on environment
 */
const baseURL: string = process.env.NODE_ENV === "production"
  ? (process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "http://localhost:8080")
  : (process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:8080");

console.log(`[api] Base URL determined: ${baseURL}`);

/**
 * Type guard to check if an error is an AxiosApiError
 */
export function isAxiosApiError(error: unknown): error is AxiosApiError {
  return (
    axios.isAxiosError(error) &&
    error.response?.data !== undefined &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  );
}

/**
 * Token refresh state management
 */
const tokenRefreshState = {
  isRefreshing: false,
  subscribers: [] as ((token: string) => void)[],

  subscribe(callback: (token: string) => void) {
    console.log("[api] Subscribing a request to wait for token refresh...");
    this.subscribers.push(callback);
  },

  notifyAll(token: string) {
    console.log("[api] Notifying all subscribed requests with new token...");
    this.subscribers.forEach(callback => callback(token));
    this.subscribers = [];
  }
};

/**
 * Helper function to set Authorization header
 */
const setAuthHeader = (config: AxiosRequestConfig, token: string): AxiosRequestConfig => {
  console.log(`[api] Setting Authorization header with token: ${token.slice(0, 10)}...`);
  if (!config.headers) {
    config.headers = {};
  }

  if (typeof config.headers === 'object') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Create and configure Axios instance
 */
const createApiInstance = (apiBaseURL: string): AxiosInstance => {

  console.log("[api] Creating API instance...");

  const instance = axios.create({
    baseURL: apiBaseURL,
    timeout: 15000,
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isAuthEndpoint = ['/login', '/signup'].some(path => config.url!.includes(path));
      console.log(`[api] Intercepting Request to: ${config.url}`);
      console.log(`[api] Is Auth Endpoint: ${isAuthEndpoint}`);

      if (typeof window !== "undefined" && !isAuthEndpoint) {
        const accessToken = getAccessToken();
        console.log(`[api] Access Token from cookies: ${accessToken ? 'Present' : 'Absent'}`);

        if (accessToken) {
          console.log("[api] Adding access token to request...");
          return setAuthHeader(config, accessToken) as InternalAxiosRequestConfig;
        }
      }
      console.log("[api] Proceeding without Authorization header...");
      return config;
    },
    (error: AxiosError) => {
      console.error("[api] Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[api] Successful response received from: ${response.config.url}`);
      return response;
    },
    async (error: AxiosError) => {
      if (!error.response) {
        console.error("[api] No response received (network/server issue)", error);
        log.error("api", "Network error or server unreachable", error);
        return Promise.reject(error);
      }

      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const isAuthEndpoint = ['/login', '/signup'].some(path => originalRequest.url?.includes(path));
      console.warn(`[api] Received error with status: ${error.response.status} from ${error.config?.url}`);

      if (error.response.status !== 401 || originalRequest._retry || isAuthEndpoint) {
        console.log("[api] Non-401 error, auth endpoints or already retried, not refreshing token.");
        return Promise.reject(error);
      }

      console.warn("[api] 401 Unauthorized error detected. Attempting token refresh...");

      originalRequest._retry = true;

      if (tokenRefreshState.isRefreshing) {
        console.log("[api] Token is already refreshing. Queuing request...");
        try {
          const newToken = await new Promise<string>((resolve) => {
            tokenRefreshState.subscribe(token => resolve(token));
          });
          console.log("[api] Received new token from queue. Retrying request...");
          return instance(setAuthHeader(originalRequest, newToken));
        } catch (queueError) {
          console.error("[api] Error while waiting for token refresh:", queueError);
          return Promise.reject(queueError);
        }
      }

      tokenRefreshState.isRefreshing = true;
      console.log("[api] Starting token refresh process...");

      try {
        const refreshToken = getRefreshToken();
        console.log(`[api] Refresh token retrieved: ${refreshToken ? 'Present' : 'Absent'}`);

        if (!refreshToken) {
          console.warn("[api] No refresh token available. Dispatching logout...");
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
          return Promise.reject(new Error("Authentication required"));
        }

        const { data } = await axios.post<Tokens>(
          `${apiBaseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          }
        );

        console.log("[api] Token refresh successful. Updating tokens...");

        setTokens(data.accessToken, data.refreshToken);
        instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        tokenRefreshState.notifyAll(data.accessToken);

        console.log("[api] Retrying original request after successful token refresh...");
        return instance(setAuthHeader(originalRequest, data.accessToken));
      } catch (refreshError) {
        console.error("[api] Token refresh failed:", refreshError);
        log.error("api", "Token refresh failed", refreshError);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(refreshError);
      } finally {
        tokenRefreshState.isRefreshing = false;
        console.log("[api] Token refresh process complete. Resetting state...");
      }
    }
  );

  return instance;
};

const api = createApiInstance(baseURL);

export default api;
