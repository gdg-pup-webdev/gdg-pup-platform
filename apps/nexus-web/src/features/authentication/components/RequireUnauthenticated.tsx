"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { STATUS, useAuthContext } from "../store/useAuthStore";
import { isOnboardingCompleted } from "@/features/onboarding/utils/onboardingStorage";

export const RequireUnauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status, decodedToken } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.AUTHENTICATED) {
      const gdgId = decodedToken?.memberInfo.gdgId;

      if (
        gdgId &&
        !isOnboardingCompleted(gdgId) &&
        pathname !== LINKS.onboarding
      ) {
        router.push(LINKS.onboarding);
        return;
      }

      router.push(LINKS.landing);
    }
  }, [status, decodedToken, pathname, router]);

  if (status === STATUS.AUTHENTICATED) {
    return (
      <>
        <div className="w-full h-full min-h-full flex justify-center items-center">
          Redirecting to landing page...
        </div>
      </>
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
