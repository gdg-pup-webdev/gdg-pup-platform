"use client";

import { useEffect, useState, useRef } from "react";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { useAuthContext } from "../store/useAuthStore";

/**
 * Component to warn users about session expiration
 * Shows modal with option to extend session
 * Auto-logs out if no action taken
 */
export const SessionExpirationWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { logout, status, refreshToken } = useAuthContext();
  const { extendSession } = useSessionTimeout({
    onWarning: (time) => {
      setTimeRemaining(time);
      setShowWarning(true);
      startAutoLogoutTimer();
    },
    onTimeout: () => {
      setShowWarning(false);
    },
  });
  const autoLogoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoLogoutTimer = () => {
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
    }
    autoLogoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 10 * 60 * 1000);
  };

  const handleStayLoggedIn = async () => {
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = null;
    }

    try {
      await refreshToken();
      extendSession();
      setShowWarning(false);
    } catch (error) {
      console.error("Failed to extend session", error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = null;
    }
    logout();
    setShowWarning(false);
  };

  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  if (!showWarning) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 1000 / 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" 
        onClick={handleStayLoggedIn}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Session Expiring Soon
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your session will expire due to inactivity in{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>{" "}
            minutes.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            Click <span className="font-bold">"Stay Logged In"</span> to continue, or you'll be automatically logged out.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-all"
          >
            Logout Now
          </button>
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};
