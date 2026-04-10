"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthTransitionCard } from "@/features/authentication/components/AuthTransitionCard";
import { resolvePostAuthTarget } from "@/features/authentication/utils/redirect";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { LINKS } from "@/lib/constants/links";

type CallbackStatus = "loading" | "success" | "error";

const NEXUS_API_URL = process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

function mapCallbackError(rawMessage: string) {
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("member") || normalized.includes("access denied")) {
    return {
      title: "Membership verification required",
      description:
        "Your account is not eligible yet. Contact your chapter admin if you should have access.",
    };
  }

  if (normalized.includes("code") || normalized.includes("expired") || normalized.includes("invalid")) {
    return {
      title: "This sign-in link is no longer valid",
      description: "Please retry your sign-in flow and use the latest redirect link.",
    };
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return {
      title: "Network issue while signing in",
      description: "We could not reach the server. Check your connection and try again.",
    };
  }

  return {
    title: "Unable to complete sign in",
    description: "Something went wrong while processing your callback. Please try again.",
  };
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken, memberProfile } = useAuthContext();

  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [description, setDescription] = useState("Completing your sign in securely...");
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [countdown, setCountdown] = useState(3);

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

    const run = async () => {
      try {
        const callbackError = searchParams.get("error");
        if (callbackError) {
          throw new Error(searchParams.get("error_description") || callbackError);
        }

        const code = searchParams.get("code");
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (!code && !accessToken) {
          throw new Error("Missing authorization code");
        }

        const payload = code
          ? { data: { code } }
          : { data: { access_token: accessToken, refresh_token: refreshToken || undefined } };

        const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok || result.status !== "success") {
          const detail = result?.errors?.[0]?.detail || result?.message || "Authentication failed";
          throw new Error(detail);
        }

        const token = result?.data?.token;
        if (token) {
          setAuthToken(token);
          setDescription("Sign in completed. Redirecting you to your account...");
        } else {
          setDescription("Verification completed. Redirecting you to Sign In...");
        }

        if (isCancelled) return;
        setStatus("success");

        const redirectTo = token
          ? destination
          : `${LINKS.auth_signin}?reason=oauth-complete`;

        for (let i = 3; i >= 1; i -= 1) {
          if (isCancelled) return;
          setCountdown(i);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (!isCancelled) {
          router.push(redirectTo);
        }
      } catch (error) {
        const rawMessage = error instanceof Error ? error.message : "Authentication failed";
        const mapped = mapCallbackError(rawMessage);

        if (isCancelled) return;
        setStatus("error");
        setDescription(mapped.description);
        setErrorDetail(rawMessage);
      }
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [destination, memberProfile?.isPublic, router, searchParams, setAuthToken]);

  if (status === "loading") {
    return (
      <AuthTransitionCard
        status="loading"
        title="Finalizing your sign in"
        description={description}
      />
    );
  }

  if (status === "success") {
    return (
      <AuthTransitionCard
        status="success"
        title="Sign in successful"
        description={description}
        countdownSeconds={countdown}
      />
    );
  }

  return (
    <AuthTransitionCard
      status="error"
      title="Sign in could not be completed"
      description={description}
      detail={errorDetail}
      primaryAction={{ label: "Back to Sign In", href: LINKS.auth_signin }}
      secondaryAction={{ label: "Go Home", href: LINKS.landing }}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthTransitionCard
          status="loading"
          title="Loading callback"
          description="Preparing your authentication callback details..."
        />
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
