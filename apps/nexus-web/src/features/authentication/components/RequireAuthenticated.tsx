"use client";

import { useRouter, usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { STATUS, useAuthContext } from "../store/useAuthStore";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/shared";

export const RequireAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status, memberProfile } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.UNAUTHENTICATED) {
      console.log("Redirecting to login... unauthenticated");
      router.push(LINKS.auth_signin);
      return;
    }

    if (status === STATUS.AUTHENTICATED) {
      // Wait for profile to load
      if (!memberProfile) return;

      // If they haven't completed onboarding, force them to do it unless they are already there
      if (memberProfile.isPublic === null && pathname !== LINKS.onboarding) {
        console.log("Redirecting to onboarding... profile incomplete");
        router.push(LINKS.onboarding);
      }
    }
  }, [status, memberProfile, pathname, router]);

  if (status === STATUS.UNAUTHENTICATED) {
    return <LoadingScreen message="Redirecting to Sign In..." />;
  }

  if (status === STATUS.CHECKING) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (status === STATUS.LOGGINGIN) {
    return <LoadingScreen message="Signing you in..." />;
  }

  return <>{children}</>;
};
