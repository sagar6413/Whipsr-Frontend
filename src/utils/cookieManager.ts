import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Save tokens to cookies
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    secure: true,
    sameSite: "strict",
  });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    secure: true,
    sameSite: "strict",
  });
};

// Get access token
export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

// Get refresh token
export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

// Clear tokens from cookies (on logout)
export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  return !!accessToken; // Returns true if accessToken exists and is not empty, false otherwise
};
