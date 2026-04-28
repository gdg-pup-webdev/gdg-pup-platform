"use client";

import { useAuthContext } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

/**
 * Modal shown when a user returns to the site and their 
 * previous session (rehydrated token) is already expired.
 */
export const SessionExpiredOnLoadModal = () => {
  const { sessionExpiredOnLoad, clearSessionExpiredOnLoad } = useAuthContext();
  const router = useRouter();

  const handleLoginAgain = () => {
    clearSessionExpiredOnLoad();
    router.push("/signin");
  };

  if (!sessionExpiredOnLoad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" 
        onClick={clearSessionExpiredOnLoad}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Session Expired
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your previous session has expired. Please log in again to continue.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleLoginAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all"
          >
            Log In Again
          </button>
          <button
            onClick={clearSessionExpiredOnLoad}
            className="w-full text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium py-2 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
