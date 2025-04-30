import { create } from "zustand";
import { persist } from "zustand/middleware"; // Add this import
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { User } from "@/types/types";
import { getCurrentUserProfile } from "@/services/userService";

interface UserState {
  user: User | null;

  setUser: (user: User) => void;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

// Use persist middleware to maintain auth state across page refreshes
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),

      fetchUser: async () => {
        try {
          const response = await getCurrentUserProfile();
          set({
            user: response,
          });
        } catch (error) {
          // Handle error, maybe logout if auth error
          if (error instanceof AxiosError) {
            console.error("Error fetching user:", error.response?.data);
          } else {
            console.error("Error fetching user:", error);
          }
          set({
            user: null,
          });
        }
      },

      clearUser: () => {
        // Clear user data and auth state
        set({
          user: null,
        });

        // Remove tokens
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      },
    }),
    {
      name: "user-storage", // Storage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        // Don't store user data if you want to always fetch it fresh
      }),
    }
  )
);
