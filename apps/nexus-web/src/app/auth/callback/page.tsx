"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { Stack, Text } from '@packages/spark-ui';

import { useAuthContext } from "@/providers/AuthProvider";

const NEXUS_API_URL =
  process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing authentication...");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for hash fragments first (Implicit Flow)
        // We MUST verify these tokens with the backend to ensure membership check is enforced.
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        const providerToken = hashParams.get("provider_token");

        if (accessToken) {
          // Verify with backend
          const response = await fetch(
            `${NEXUS_API_URL}api/auth-system/exchange`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: {
                  access_token: accessToken,
                  refresh_token: refreshToken || undefined,
                },
              }),
            },
          );

          const result = await response.json();

          if (!response.ok || result.status !== "success") {
            const detail = result.errors?.[0]?.detail;
            const message =
              detail || result.message || "Failed to verify session token";
            throw new Error(message);
          }

          // Store session tokens (from backend response to be safe, or original)
          // Backend returns the valid session.
          if (result.data?.session?.access_token) {
            setCookie("supabaseAccessToken", result.data.session.access_token, {
              maxAge: 60 * 60,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
          }

          if (result.data?.session?.refresh_token) {
            setCookie(
              "supabaseRefreshToken",
              result.data.session.refresh_token,
              {
                maxAge: 60 * 60 * 24 * 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              },
            );
          }

          if (result.data?.session?.provider_token || providerToken) {
            setCookie(
              "googleAccessToken",
              result.data.session?.provider_token || providerToken,
              {
                maxAge: 60 * 60,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              },
            );
          }

          await refreshSession();

          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          setLoading(false);

          setTimeout(() => {
            router.push("/");
          }, 1500);
          return;
        }

        // Only check for authorization code (code flow)
        // We strictly ignore hash fragments to prevent bypassing backend membership checks
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Collect all URL parameters for debugging
        const allParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });

        setDebugInfo({
          url: typeof window !== "undefined" ? window.location.href : "N/A",
          params: allParams,
          hasCode: !!code,
          hasError: !!errorParam,
        });

        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }

        if (!code) {
          throw new Error(
            `No authorization code or access token received. Check debug info below.`,
          );
        }

        // Exchange code for session
        const response = await fetch(
          `${NEXUS_API_URL}api/auth-system/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { code } }),
          },
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
          const detail = result.errors?.[0]?.detail;
          const message =
            detail || result.message || "Failed to exchange authorization code";
          throw new Error(message);
        }

        // Store session tokens
        if (result.data?.session?.access_token) {
          setCookie("supabaseAccessToken", result.data.session.access_token, {
            maxAge: 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }

        if (result.data?.session?.refresh_token) {
          setCookie("supabaseRefreshToken", result.data.session.refresh_token, {
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }

        if (result.data?.session?.provider_token) {
          setCookie("googleAccessToken", result.data.session.provider_token, {
            maxAge: 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }

        await refreshSession();

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");
        setLoading(false);

        // Redirect to home or dashboard
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setError(err.message || "Authentication failed");
        setStatus("error");
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-blue-50">
        <Stack gap="md" className="text-center">
          <div className="text-green-500 text-6xl">✓</div>
          <Text variant="heading-2" className="text-gray-800">Success!</Text>
          <Text variant="body" className="text-gray-700">{message}</Text>
        </Stack>
      </div>
    );
  }

  const isMembershipError =
    error?.toLowerCase().includes("member") ||
    error?.toLowerCase().includes("access denied");

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Stack gap="md" className="max-w-2xl w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <Stack gap="md">
              <Text variant="heading-2" className="text-red-600">
                Authentication Error
              </Text>
              <Text variant="body" className="text-red-700">{error}</Text>
              {isMembershipError && (
                <div className="p-4 bg-yellow-50 text-yellow-900 rounded-md border border-yellow-200">
                  <Stack gap="xs">
                    <Text variant="label">Membership Required</Text>
                    <Text variant="body-sm">
                      You must be a registered GDG member to sign in.
                    </Text>
                  </Stack>
                </div>
              )}
            </Stack>
          </div>

          {debugInfo && (
            <div className="bg-gray-100 rounded-lg p-6">
              <Stack gap="sm">
                <Text variant="heading-3">Debug Information</Text>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </Stack>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <Stack gap="sm">
              <Text variant="heading-3" className="text-blue-900">
                Troubleshooting Steps
              </Text>
              <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
                <li>
                  Check that the redirect URL is configured in Supabase dashboard
                </li>
                <li>Verify that Google OAuth is enabled in Supabase</li>
                <li>Ensure the backend API is running on {NEXUS_API_URL}</li>
                <li>Check browser console for additional errors</li>
              </ul>
            </Stack>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </Stack>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Stack gap="md" className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <Text variant="body" className="text-gray-700">{message}</Text>
      </Stack>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Stack gap="md" className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <Text variant="body" className="text-gray-700">Loading authentication...</Text>
          </Stack>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
