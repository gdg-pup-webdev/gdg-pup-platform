"use client";

import { useEffect, useState, useRef } from "react";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { useAuthContext } from "../store/useAuthStore";
import { Modal, Button, Text, Stack, Inline } from "@packages/spark-ui";

/**
 * Component to warn users about session expiration
 * Shows modal at 1:50 mark with option to extend session
 * Auto-logs out if no action taken within 10 minutes
 */
export const SessionExpirationWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { logout, status, refreshToken } = useAuthContext();
  const { extendSession } = useSessionTimeout({
    onWarning: (time) => {
      setTimeRemaining(time);
      setShowWarning(true);
      // Start countdown to auto-logout if user doesn't respond
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
    // Auto-logout after 10 minutes of warning if user doesn't respond
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
      // Refresh token to extend session using the store's refreshToken method
      await refreshToken();
      // Update the timeout reference and close warning
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
    // Set a flag or just call logout directly before hiding the warning
    // to avoid the onOpenChange refresh trigger
    logout();
    setShowWarning(false);
  };

  const handleOpenChange = (open: boolean) => {
    // If the modal is being closed and we haven't logged out, refresh the session
    if (!open && showWarning && status === "authenticated") {
      handleStayLoggedIn();
    } else {
      setShowWarning(open);
    }
  };

  // Update time remaining display
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
    <Modal open={showWarning} onOpenChange={handleOpenChange} size="md" className="!bg-[#0a162a] border border-white/10 !p-0">
      <Stack gap="md" className="p-8">
        <div className="text-center">
          <Text variant="heading-3" className="font-bold text-white mb-2">
            Session Expiring Soon
          </Text>
          <Text variant="body-sm" className="text-white/70 mb-4">
            Your session will expire due to inactivity. You have{" "}
            <span className="font-bold text-white">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>{" "}
            minutes remaining.
          </Text>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <Text variant="caption" className="text-yellow-200/90 leading-relaxed text-center block">
            Click <span className="font-bold">"Stay Logged In"</span> to continue your session, or you'll be automatically logged out.
          </Text>
        </div>

        <Inline gap="md" className="pt-6">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex-1 !bg-white/5 !text-white !border-white/10 hover:!bg-white/10"
          >
            Logout Now
          </Button>
          <Button
            variant="default"
            onClick={handleStayLoggedIn}
            className="flex-1 !bg-gradient-to-t !from-[#2b7fff] !to-[#162456] !border-none !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)]"
          >
            Stay Logged In
          </Button>
        </Inline>
      </Stack>
    </Modal>
  );
};
