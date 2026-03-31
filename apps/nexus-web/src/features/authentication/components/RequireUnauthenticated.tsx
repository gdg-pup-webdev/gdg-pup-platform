"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/links";
import { STATUS, useAuthContext } from "../store/useAuthStore";

export const RequireUnauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { status } = useAuthContext();

  useEffect(() => {
    if (status === STATUS.AUTHENTICATED) {
      router.push(LINKS.landing);
    }
  }, [status]);

  if (status === STATUS.AUTHENTICATED) {
    return (
      <>
        <div className="w-full h-full min-h-full flex justify-center items-center">
          Redirecting to landing page...
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

  if (status === STATUS.LOGGINGOUT) {
    <>
      <div className="w-full h-full min-h-full flex justify-center items-center">
        Loggin out...
      </div>
    </>;
  }

  return <>{children}</>;
};
