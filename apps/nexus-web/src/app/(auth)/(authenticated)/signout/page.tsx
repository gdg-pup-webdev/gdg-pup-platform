"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/features/authentication/store/useAuthStore';
import { AuthTransitionCard } from '@/features/authentication/components/AuthTransitionCard';
import { resolvePostLogoutTarget } from '@/features/authentication/utils/redirect';

const page = () => {
    const { logout } = useAuthContext();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [countdown, setCountdown] = useState(2);
    const [message, setMessage] = useState("Signing you out securely...");
    const [detail, setDetail] = useState<string | undefined>(undefined);

    const queries = useSearchParams();
    const callbackUrl = queries.get('callbackUrl') || null;

    const router = useRouter();

    useEffect(() => {
        let isCancelled = false;

        const stuff = async () => {
          try {
            await logout();
            if (isCancelled) return;

            setStatus("success");
            setMessage("You have been signed out.");

            for (let i = 2; i >= 1; i -= 1) {
              if (isCancelled) return;
              setCountdown(i);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            if (!isCancelled) {
              router.push(resolvePostLogoutTarget(callbackUrl));
            }
          } catch (error) {
            if (isCancelled) return;

            const raw = error instanceof Error ? error.message : "Failed to sign out";
            setStatus("error");
            setMessage("We could not complete sign out cleanly, but you can continue to Sign In.");
            setDetail(raw);
          }
        }

        stuff();
        return () => {
          isCancelled = true;
        };
    }, [callbackUrl, logout, router]);

  if (status === "loading") {
    return (
      <AuthTransitionCard
        status="loading"
        title="Signing out"
        description={message}
      />
    );
  }

  if (status === "success") {
    return (
      <AuthTransitionCard
        status="success"
        title="Signed out"
        description={message}
        countdownSeconds={countdown}
      />
    );
  }

  return (
    <AuthTransitionCard
      status="error"
      title="Sign out issue"
      description={message}
      detail={detail}
      primaryAction={{ label: "Go to Sign In", href: "/signin" }}
      secondaryAction={{ label: "Go Home", href: "/" }}
    />
  );
}

export default page;