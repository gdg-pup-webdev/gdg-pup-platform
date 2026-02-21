"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack, Text } from "@packages/spark-ui";

const NEXUS_API_URL =
  process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

function ConfirmPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token_hash and type from URL parameters
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        console.log("Verification attempt:", {
          token_hash,
          type,
          NEXUS_API_URL,
        });

        if (!token_hash || !type) {
          setStatus("error");
          setMessage("Invalid verification link. Please try signing up again.");
          return;
        }

        // Call backend API to verify
        const url = `${NEXUS_API_URL}api/auth-system/verify`;
        console.log("Calling API:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { token_hash, type } }),
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          setStatus("error");
          setMessage(
            `Server returned non-JSON response. Status: ${response.status}`,
          );
          return;
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok || data.status !== "success") {
          // Extract detailed error if available
          let errorMessage = data.message;
          if (
            data.errors &&
            Array.isArray(data.errors) &&
            data.errors.length > 0
          ) {
            errorMessage =
              data.errors[0].detail || data.errors[0].title || errorMessage;
          }

          console.error("Verification error:", errorMessage, data);
          setStatus("error");
          setMessage(
            errorMessage || "Failed to verify email. Please try again.",
          );
          return;
        }

        if (data.data?.user) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting...");

          // Redirect to home or dashboard after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Verification failed. Please try again.");
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setStatus("error");
        setMessage(`An unexpected error occurred: ${err.message}`);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <Stack gap="md" className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <Text variant="heading-2" className="text-gray-800">
                Verifying Email
              </Text>
              <Text variant="body" className="text-gray-600">
                {message}
              </Text>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-green-500 text-6xl">✓</div>
              <Text variant="heading-2" className="text-gray-800">
                Email Verified!
              </Text>
              <Text variant="body" className="text-gray-600">
                {message}
              </Text>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-red-500 text-6xl">✗</div>
              <Text variant="heading-2" className="text-gray-800">
                Verification Failed
              </Text>
              <Text variant="body" className="text-gray-600">
                {message}
              </Text>
              <button
                onClick={() => router.push("/")}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Go to Home
              </button>
            </>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <Stack gap="md">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <Text variant="body" className="text-gray-600">
                Loading verification...
              </Text>
            </Stack>
          </div>
        </div>
      }
    >
      <ConfirmPageContent />
    </Suspense>
  );
}
