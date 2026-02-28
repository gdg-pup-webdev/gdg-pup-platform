"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "./LoadingScreen";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Where to redirect unauthenticated users. Defaults to "/signin". */
  redirectTo?: string;
}

/**
 * AuthGuard
 *
 * Wraps any subtree that requires an authenticated user.
 * - While auth status is being checked, renders a loading screen.
 * - Once resolved, redirects unauthenticated users to `redirectTo`.
 * - Authenticated users see `children` normally.
 */
export function AuthGuard({ children, redirectTo = "/signin" }: AuthGuardProps) {
  const { user, status } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (status === "checking") return;
    if (!user) {
      router.push(redirectTo);
    }
  }, [user, status, router, redirectTo]);

  if (status === "checking") {
    return <LoadingScreen />;
  }

  if (!user) {
    // Render nothing while the redirect is in flight
    return null;
  }

  return <>{children}</>;
}
