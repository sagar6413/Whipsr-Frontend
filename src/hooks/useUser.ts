import { useState, useCallback } from "react";
import { getCurrentUserProfile, updateUsername, deleteAccount } from "@/services/userService";
import { User, UsernameUpdateRequest } from "@/types/types";
import { log } from "@/utils/logger";
import { isAxiosApiError } from "@/services/axiosInstance";
import { useUserStore } from "@/store/userStore";

export const useUser = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser, clearUser } = useUserStore();

    const handleError = useCallback((functionName: string, error: unknown) => {
        const errorMessage = isAxiosApiError(error) ?
            error.response?.data?.message || error.message :
            error instanceof Error ? error.message : 'An unknown error occurred';

        log.error(`useUser.${functionName}`, "Operation failed",
            isAxiosApiError(error) ? error.response?.data : error);

        setError(errorMessage);
        return false;
    }, []);

    const fetchUserProfile = useCallback(async (): Promise<User | null> => {
        setLoading(true);
        setError(null);
        log.debug("useUser.fetchUserProfile", "Fetching user profile");

        try {
            const userData = await getCurrentUserProfile();
            setUser(userData);
            log.info("useUser.fetchUserProfile", "User profile loaded successfully");
            return userData;
        } catch (err) {
            handleError("fetchUserProfile", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setUser, handleError]);

    const changeUsername = useCallback(async (data: UsernameUpdateRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        log.debug("useUser.changeUsername", "Updating username");

        try {
            const updatedUser = await updateUsername(data);
            setUser(updatedUser);
            log.info("useUser.changeUsername", "Username updated successfully");
            return true;
        } catch (err) {
            return handleError("changeUsername", err);
        } finally {
            setLoading(false);
        }
    }, [setUser, handleError]);


    const removeAccount = useCallback(async (): Promise<boolean> => {
        setLoading(true);
        setError(null);
        log.debug("useUser.removeAccount", "Deleting account");

        try {
            await deleteAccount();
            clearUser();
            log.info("useUser.removeAccount", "Account deleted successfully");
            return true;
        } catch (err) {
            return handleError("removeAccount", err);
        } finally {
            setLoading(false);
        }
    }, [clearUser, handleError]);

    const clearError = useCallback(() => setError(null), []);

    return {
        user: useUserStore(state => state.user),
        fetchUserProfile,
        changeUsername,
        removeAccount,
        loading,
        error,
        clearError
    };
};