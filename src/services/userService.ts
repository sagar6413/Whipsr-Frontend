import api from "./api";
import {
  User,
  UpdateUsernameRequestDto,
  ChangePasswordRequestDto,
  AxiosApiError,
  UserProfileResponse,
} from "../types/api"; // Adjust path as needed

/**
 * Fetches the profile information for the currently authenticated user.
 * @returns Promise resolving with the user's profile data.
 */
export const getCurrentUserProfile = async (): Promise<User> => {
  try {
    // Expect the wrapped response structure
    const response = await api.get<UserProfileResponse>("/users/me");
    // Return the actual user data from the 'data' field
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      // Throw an error if success is false or data is missing
      throw new Error(
        response.data?.message ||
          "Failed to fetch user profile: Invalid API response"
      );
    }
  } catch (error) {
    console.error(
      "Failed to fetch user profile:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Updates the current user's username.
 * @param data - Object containing the new username.
 * @returns Promise resolving with the updated user object.
 */
export const updateUsername = async (
  data: UpdateUsernameRequestDto
): Promise<User> => {
  try {
    const response = await api.put<User>("/users/me/username", data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update username:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Changes the current user's password.
 * Assumes endpoint PUT /users/me/password
 * @param data - Object containing currentPassword, newPassword, confirmPassword.
 * @returns Promise resolving with a success message (or potentially the updated user object).
 */
export const changePassword = async (
  data: ChangePasswordRequestDto
): Promise<{ message: string }> => {
  try {
    // TODO: Update endpoint if different
    const response = await api.put<{ message: string }>(
      "/users/me/password",
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to change password:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};

/**
 * Deletes the current user's account.
 * Assumes endpoint DELETE /users/me
 * @returns Promise resolving with a success message.
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  try {
    // TODO: Update endpoint if different
    const response = await api.delete<{ message: string }>("/users/me");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to delete account:",
      (error as AxiosApiError).response?.data || error
    );
    throw error;
  }
};
