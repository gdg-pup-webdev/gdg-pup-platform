"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { STATUS, useAuthContext } from "../store/useAuthStore";

export const RequireUnauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
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

      // Already onboarded, redirect away from auth pages to their profile
      if (pathname !== LINKS.onboarding) {
        router.push(LINKS.sparkmates_me);
      }
    }
  }, [status, memberProfile, pathname, router]);

  if (status === STATUS.AUTHENTICATED || status === STATUS.CHECKING) {
    const message = status === STATUS.CHECKING ? "Checking session..." : "Redirecting...";
    return (
      <div className="w-full h-full min-h-screen flex justify-center items-center text-zinc-400 animate-pulse">
        {message}
      </div>
    );
  }

  if (status === STATUS.LOGGINGOUT) {
    <>
      <div className="w-full h-full min-h-full flex justify-center items-center">
        Loggin out...
      </div>
    </>;
  }

  return <>{children}</>;
};
