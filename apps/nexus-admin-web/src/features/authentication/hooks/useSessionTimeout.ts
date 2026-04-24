"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "../store/useAuthStore";

const WARNING_THRESHOLD_MS = 10 * 60 * 1000; // Show warning 10 minutes before timeout
const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute
const INACTIVITY_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

interface SessionTimeoutConfig {
  onWarning?: (timeRemaining: number) => void;
  onTimeout?: () => void;
}

/**
 * Hook to manage session inactivity timeout
 * Resets the inactivity timer on any user activity
 * Silently refreshes token if user was active within the last 2 hours
 * Shows warning if user has been completely idle for more than 2 hours
 * Auto-logs out user ONLY when the token officially expires
 */
export const useSessionTimeout = (config: SessionTimeoutConfig = {}) => {
  const { status, logout, decodedToken, refreshToken } = useAuthContext();
  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef<boolean>(false);
  const isAuthenticatedRef = useRef<boolean>(false);

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false; // Reset warning flag on new activity
  }, []);

  // Check for session timeout
  const checkSessionTimeout = useCallback(async () => {
    if (!decodedToken?.validUntil) return;

    const validUntilTime = new Date(decodedToken.validUntil).getTime();
    const now = Date.now();
    const timeUntilTokenExpires = validUntilTime - now;
    const timeSinceLastActivity = now - lastActivityRef.current;

    // 1. Token officially expired -> Logout
    if (timeUntilTokenExpires <= 0) {
      console.warn("Token expired: logging out user");
      if (config.onTimeout) {
        config.onTimeout();
      }
      logout();
      return;
    }

    // 2. 10 minutes left in token validity
    if (timeUntilTokenExpires <= WARNING_THRESHOLD_MS) {
      // 2a. If there was activity in the last 2 hours, silently refresh
      if (timeSinceLastActivity < INACTIVITY_THRESHOLD_MS) {
        console.debug("Approaching expiry but user has been active. Silently refreshing...");
        try {
          await refreshToken();
        } catch (error) {
          console.error("Silent refresh failed", error);
        }
        return;
      }

      // 2b. If totally idle for > 2 hours, show warning modal
      if (!warningShownRef.current && isAuthenticatedRef.current) {
        warningShownRef.current = true;
        console.warn(
          `Session warning: ${Math.round(timeUntilTokenExpires / 1000 / 60)} minutes remaining`
        );
        if (config.onWarning) {
          config.onWarning(timeUntilTokenExpires);
        }
      }
    }
  }, [logout, refreshToken, decodedToken, config]);

  // Setup activity listeners
  useEffect(() => {
    if (status !== "authenticated" || !decodedToken) {
      isAuthenticatedRef.current = false;
      return;
    }

    isAuthenticatedRef.current = true;
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;

    // Activity event listeners
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    // Setup timeout check interval
    checkIntervalRef.current = setInterval(checkSessionTimeout, CHECK_INTERVAL_MS);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [status, decodedToken, updateActivity, checkSessionTimeout]);

  // Return function to extend session (called when user clicks "Stay Logged In")
  const extendSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  return {
    extendSession,
    getTimeRemaining: () => {
      if (!decodedToken?.validUntil) return 0;
      return Math.max(0, new Date(decodedToken.validUntil).getTime() - Date.now());
    },
  };
};
