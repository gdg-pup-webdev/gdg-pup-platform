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
  const { status } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.UNAUTHENTICATED) {
      router.push(LINKS.auth_signin);
    }
  }, [status]);

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
