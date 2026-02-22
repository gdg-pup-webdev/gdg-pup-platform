/**
 * Card Tap Page (Route)
 * 
 * This page handles the /tap/[cardUid] route.
 * It's triggered when someone scans an NFC card or QR code.
 * 
 * The page's responsibility is to:
 * 1. Extract the cardUid from the URL
 * 2. Render the CardTapRouter component
 * 
 * All logic has been moved to the card-tap feature for better organization.
 */

"use client";

import { useParams } from "next/navigation";
import { CardTapRouter } from "@/features/card-tap";
import { useEffect, useState } from "react";
import { configs } from "@/configs/servers.config";

// Define the shape of the status response
interface CardStatus {
  status: "READY" | "ACTIVE" | "LOST";
  userId: string | null;
}

export default function TapRouterPage() {
  // Get the cardUid from the URL parameters
  // For example: /tap/ABC123 -> cardUid will be "ABC123"
  const { cardUid } = useParams();

  useEffect(() => {
    const checkCardStatus = async () => {
      try {
        const apiUrl = configs.identityApiBaseUrl;
        // Ensure slash between host and api
        const res = await fetch(
          `${apiUrl}/api/card-system/cards/${cardUid}/status`,
        );
        console.log("Card status response:", res.status);

        const json = await res.json();
        console.log("Card status JSON:", json);
        if (json.status !== "success") {
          if (res.status === 404) {
            setError("This card is not on the list.");
            return;
          }
          throw new Error(json.message || "Failed to check card status.");
        }

        const { card, user } = json.data;

        let redirectPath = "";
        let statusMessage = "";

        if (card.status === "READY") {
          redirectPath = `/activate/${cardUid}`;
          statusMessage = "Card is READY. Redirecting to activation.";
        } else if (card.status === "ACTIVE") {
          const targetId = user?.id || card.user_id;
          redirectPath = `/id/${targetId}`;
          statusMessage = "Card is ACTIVE. Redirecting to profile.";
        } else {
          setError("This card is not on the list.");
          return;
        }

        // FOR TESTING: Display info instead of redirecting
        setDebugData({
          card,
          user,
          redirectPath,
          statusMessage,
        });

        // router.replace(redirectPath);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cardUid) {
      checkCardStatus();
    }
  }, [cardUid, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="mt-2 text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (debugData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-6 p-4">
        <h1 className="text-3xl font-bold text-green-500">Testing Mode</h1>

        <div className="w-full max-w-md space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Status</h2>
            <p className="text-lg font-semibold">{debugData.statusMessage}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-zinc-400">
              Redirect Target
            </h2>
            <code className="block rounded bg-zinc-950 p-2 text-blue-400">
              {debugData.redirectPath}
            </code>
          </div>

          <div>
            <h2 className="text-sm font-medium text-zinc-400">Raw Data</h2>
            <pre className="max-h-40 overflow-auto rounded bg-zinc-950 p-2 text-xs text-zinc-500">
              {JSON.stringify(
                { card: debugData.card, user: debugData.user },
                null,
                2,
              )}
            </pre>
          </div>

          <button
            onClick={() => router.push(debugData.redirectPath)}
            className="w-full rounded bg-white py-2 font-bold text-black hover:bg-zinc-200"
          >
            Proceed to Redirect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white"></div>
        <p className="mt-4 text-zinc-400">Reading card...</p>
      </div>
    </div>
  );
}
