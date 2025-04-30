// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Always try to fetch user on first load to ensure auth state is current
      if (!useUserStore.getState().user) {
        try {
          await fetchUser();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }

      // Get the freshest state after potential fetch
      const freshAuthState = useUserStore.getState().isAuthenticated;

      // If authenticated and on auth pages, redirect to home
      if (freshAuthState && isAuthRoute(pathname)) {
        router.replace("/");
        return;
      }

      // If not authenticated and on protected route, redirect to login
      if (!freshAuthState && !isPublicRoute(pathname)) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
    };

    checkAuth();
  }, [isAuthenticated, fetchUser, pathname, router]);

  // Public routes that don't need authentication
  const isPublicRoute = (path: string) => {
    const publicRoutes = [
      "/login",
      "/register",
      "/signup",
      "/forgot-password",
      "/reset-password",
    ];
    return publicRoutes.some((route) => path.startsWith(route));
  };

  // Auth routes that authenticated users shouldn't access
  const isAuthRoute = (path: string) => {
    const authRoutes = ["/login", "/register", "/signup", "/forgot-password"];
    return authRoutes.some((route) => path === route || path === `${route}/`);
  };

  // Show loading state during authentication check
  if (
    // Show loading when:
    // 1. On protected route and not authenticated (will redirect)
    (!isAuthenticated && !isPublicRoute(pathname)) ||
    // 2. On auth route and authenticated (will redirect)
    (isAuthenticated && isAuthRoute(pathname))
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Otherwise render children
  return <>{children}</>;
};
