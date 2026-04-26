"use client";

import { useRouter } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { STATUS, useAuthContext } from "../store/useAuthStore";
import { useEffect } from "react";

export const RequireAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { status, decodedToken, logout } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.UNAUTHENTICATED) {
      console.log("Redirecting to login... unauthenticated");
      router.push(LINKS.auth_signin);
      return;
    }

    // Check if token is expired
    if (decodedToken?.validUntil) {
      const now = new Date();
      const validUntil = new Date(decodedToken.validUntil);
      if (now > validUntil) {
        console.log("Token expired, logging out");
        logout();
        router.push(LINKS.auth_signin);
        return;
      }
    }
  }, [status, decodedToken, logout, router]);

  if (status === STATUS.UNAUTHENTICATED) {
    return (
      <>
        <div className="w-full h-full min-h-full flex justify-center items-center">
          Redirecting to login...
        </div>
      </>
    );
  }

  if (status === STATUS.CHECKING) {
    return (
      <>
        <div className="w-full h-full min-h-full flex justify-center items-center">
          Checking authentication...
        </div>
      </>
    );
  }

  if (status === STATUS.LOGGINGIN) {
    return (
      <>
        <div className="w-full h-full min-h-full flex justify-center items-center">
          Logging in...
        </div>
      </>
    );
  }

  return <>{children}</>;
};
