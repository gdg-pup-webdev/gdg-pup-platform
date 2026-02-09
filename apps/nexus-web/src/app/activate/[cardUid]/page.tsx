"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ActivateCardPage() {
  const { cardUid } = useParams();
  const { user, loginWithGoogle, token, status: authStatus } = useAuthContext();
  const router = useRouter();

  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    if (!user) return;

    setIsActivating(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:8100";
      const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

      const response = await fetch(
        `${baseUrl}api/card-system/cards/${cardUid}/activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              userId: user.id,
            },
          }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to activate card");
      }

      toast.success("Card activated successfully!");
      router.push(`/id/${user.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Activate Nexus Card
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-mono">{cardUid}</p>
        </div>

        {authStatus === "checking" ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-white rounded-full mb-4"></div>
            <p className="text-zinc-400 text-sm">Checking authentication...</p>
          </div>
        ) : !user ? (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
              <p className="text-yellow-200 text-sm">
                You need to be logged in to link this card to your account.
              </p>
            </div>
            <button
              onClick={loginWithGoogle}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-4">
              <img
                src={
                  user.user_metadata?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                }
                alt="User"
                className="w-12 h-12 rounded-full bg-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-400">Activating as</p>
                <p className="font-semibold truncate">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActivating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  <span>Activating...</span>
                </>
              ) : (
                <span>Confirm Activation</span>
              )}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            By activating, you agree to link this physical card to your digital
            Use System profile.
          </p>
        </div>
      </div>
    </div>
  );
}
