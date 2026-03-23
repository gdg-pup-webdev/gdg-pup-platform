"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore"; 
import { LINKS } from "@/lib/constants/links";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Ensure unauthenticated users are redirected from protected admin routes
  useEffect(() => {
    if (!isHydrated) return;

    // We don't want to redirect if they are already on the login or signup page
    if (
      !token &&
      pathname !==  LINKS.auth_signin
    ) {
      router.replace( LINKS.auth_signin);
    }
  }, [isHydrated, token, pathname, router]);

  if (!isHydrated) {
    return null; // Avoid hydration mismatch
  }

  // Prevent rendering protected content if unauthenticated
  if (!token && pathname !==  LINKS.auth_signin && pathname !== "/authentication/signup") {
    return null; 
  }

  return <>{children}</>;
};
