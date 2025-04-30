import api from "./axiosInstance";
import { User, UsernameUpdateRequest } from "../types/types";
import { log } from "@/utils/logger";

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<User> => {
  log.debug("getCurrentUserProfile", "Fetching current user profile");
  const response = await api.get<User>("/users/me");
  log.info("getCurrentUserProfile", "User profile fetched successfully");
  return response.data;
};

/**
 * Update the user's username
 */
export const updateUsername = async (data: UsernameUpdateRequest): Promise<User> => {
  log.debug("updateUsername", "Updating username");
  const response = await api.put<User>("/users/me/username", data);
  log.info("updateUsername", "Username updated successfully");
  return response.data;
};

/**
 * Delete the user's account
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  log.debug("deleteAccount", "Deleting user account");
  const response = await api.delete<{ message: string }>("/users/me");
  log.info("deleteAccount", "Account deleted successfully");
  return response.data;
};

// Commented out code left as-is for future reference
// export const updateUserProfile = async (
//   data: Partial<User>
// ): Promise<ApiResponse<User>> => {
//   try {
//     log.debug("updateUserProfile", "Updating user profile");
//     const response = await api.patch<ApiResponse<User>>("/users/profile", data);
//     log.info("updateUserProfile", "Profile updated successfully");
//     return response.data;
//   } catch (error) {
//     log.error(
//       "updateUserProfile",
//       "Profile update failed",
//       isAxiosApiError(error) ? error.response?.data : error
//     );
//     throw error;
//   }
// };