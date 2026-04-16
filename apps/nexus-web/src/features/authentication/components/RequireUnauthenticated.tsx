"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { LoadingScreen } from "@/components/shared";
import { STATUS, useAuthContext } from "../store/useAuthStore";

export const RequireUnauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, memberProfile } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.AUTHENTICATED) {
      // Wait for profile to load before making redirection decisions
      if (!memberProfile) return;

      // If isPublic is null, it means they haven't finished onboarding
      if (memberProfile.isPublic === null && pathname !== LINKS.onboarding) {
        router.push(LINKS.onboarding);
        return;
      }

      // Already onboarded, redirect away from auth pages
      if (pathname !== LINKS.onboarding) {
        const next = searchParams.get("next");
        if (next && next.startsWith("/")) {
          router.push(next);
        } else {
          router.push(LINKS.sparkmates_me);
        }
      }
    }
  }, [status, memberProfile, pathname, router, searchParams]);

  if (status === STATUS.AUTHENTICATED || status === STATUS.CHECKING) {
    const message =
      status === STATUS.CHECKING
        ? "Checking your session..."
        : "Taking you to your account...";
    return <LoadingScreen message={message} fullPage={false} showBackground={false} />;
  }

  if (status === STATUS.LOGGINGOUT) {
    return <LoadingScreen message="Signing you out..." fullPage={false} showBackground={false} />;
  }

  return <>{children}</>;
};
