"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { LINKS } from "@/lib/constants/links";
import { useAuthContext } from "../store/useAuthStore";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const {token } = useAuthContext();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push(LINKS.auth_signin);
    }

    if (token) {
      if (pathname === LINKS.auth_signin || pathname === LINKS.auth_signup) {
        router.push(LINKS.profile_me);
      }
    }
  }, [isHydrated, token, pathname]);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};
