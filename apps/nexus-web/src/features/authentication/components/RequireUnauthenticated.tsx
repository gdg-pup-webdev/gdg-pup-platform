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
      console.log("User is authenticated, redirecting to landing page");
      router.push(LINKS.landing);
    }
    console.log("Authentication status:", status);
  }, [status]);

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
