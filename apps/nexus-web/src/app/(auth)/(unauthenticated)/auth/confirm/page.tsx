"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthTransitionCard } from "@/features/authentication/components/AuthTransitionCard";
import { resolvePostAuthTarget } from "@/features/authentication/utils/redirect";
import { LINKS } from "@/lib/constants/links";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

const NEXUS_API_URL =
  process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

function ConfirmPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken, memberProfile } = useAuthContext();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(3);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);

  const destination = useMemo(
    () =>
      resolvePostAuthTarget({
        next: searchParams.get("next"),
        callbackUrl: searchParams.get("callbackUrl"),
        isOnboarded: memberProfile?.isPublic !== null,
      }),
    [memberProfile?.isPublic, searchParams],
  );

  useEffect(() => {
    let isCancelled = false;

    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (!token_hash || !type) {
          setStatus("error");
          setMessage("Invalid verification link. Please try signing up again.");
          setErrorDetail("Missing token_hash or type query parameter.");
          return;
        }

        const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { token_hash, type } }),
        });

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          const errorMessage =
            data?.errors?.[0]?.detail ||
            data?.errors?.[0]?.title ||
            data?.message ||
            "Failed to verify email. Please try again.";

          throw new Error(errorMessage);
        }

        const token = data?.data?.token;
        if (token) {
          setAuthToken(token);
          setMessage("Email verified successfully. Redirecting you to your account...");
        } else {
          setMessage("Email verified successfully. Redirecting you to Sign In...");
        }

        if (isCancelled) return;
        setStatus("success");

        const redirectTo = token
          ? destination
          : `${LINKS.auth_signin}?reason=verify-success`;

        for (let i = 3; i >= 1; i -= 1) {
          if (isCancelled) return;
          setCountdown(i);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (!isCancelled) {
          router.push(redirectTo);
        }
      } catch (err: any) {
        const rawMessage = err?.message || "Verification failed";
        const lower = rawMessage.toLowerCase();

        const friendlyMessage =
          lower.includes("expired") || lower.includes("invalid")
            ? "This verification link is no longer valid. Please request a new one."
            : "We could not verify your email right now. Please try again.";

        setStatus("error");
        setMessage(friendlyMessage);
        setErrorDetail(rawMessage);
      }
    };

    confirmEmail();
    return () => {
      isCancelled = true;
    };
  }, [destination, memberProfile?.isPublic, router, searchParams, setAuthToken]);

  if (status === "loading") {
    return (
      <AuthTransitionCard
        status="loading"
        title="Verifying your email"
        description={message}
      />
    );
  }

  if (status === "success") {
    return (
      <AuthTransitionCard
        status="success"
        title="Email verified"
        description={message}
        countdownSeconds={countdown}
      />
    );
  }

  return (
    <AuthTransitionCard
      status="error"
      title="Verification failed"
      description={message}
      detail={errorDetail}
      primaryAction={{ label: "Go to Sign In", href: LINKS.auth_signin }}
      secondaryAction={{ label: "Go Home", href: LINKS.landing }}
    />
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <AuthTransitionCard
          status="loading"
          title="Loading verification"
          description="Preparing your verification details..."
        />
      }
    >
      <ConfirmPageContent />
    </Suspense>
  );
}
