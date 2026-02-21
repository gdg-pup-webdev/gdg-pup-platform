/**
 * Custom hook for debugging authentication state
 *
 * This hook provides access to authentication state and methods
 * specifically formatted for debugging purposes.
 */

import { useAuthContext } from "@/providers/AuthProvider";
import { DebugAuthState } from "../types";

/**
 * Hook to access authentication state for debugging
 *
 * @returns Authentication state formatted for debugging display
 *
 * @example
 * ```tsx
 * function DebugPanel() {
 *   const { authState, loginWithGoogle, logout, copyToken } = useDebugAuth();
 *
 *   return (
 *     <div>
 *       <p>Status: {authState.status}</p>
 *       <button onClick={loginWithGoogle}>Login</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDebugAuth() {
  const authContext = useAuthContext();

  /**
   * Format the auth context into a debug-friendly state object
   */
  const authState: DebugAuthState = {
    token: authContext.token,
    googleAccessToken: authContext.googleAccessToken,
    status: authContext.status,
    user: authContext.user,
  };

  /**
   * Copy authentication token to clipboard
   *
   * @returns Success or error toast notification
   */
  const copyToken = async (): Promise<boolean> => {
    if (authContext.token) {
      try {
        await navigator.clipboard.writeText(authContext.token);
        return true;
      } catch (error) {
        console.error("Failed to copy token:", error);
        return false;
      }
    }
    return false;
  };

  /**
   * Copy Google access token to clipboard
   *
   * @returns Success or error toast notification
   */
  const copyGoogleAccessToken = async (): Promise<boolean> => {
    if (authContext.googleAccessToken) {
      try {
        await navigator.clipboard.writeText(authContext.googleAccessToken);
        return true;
      } catch (error) {
        console.error("Failed to copy Google access token:", error);
        return false;
      }
    }
    return false;
  };

  /**
   * Get formatted JSON string of auth state for display
   */
  const getFormattedAuthState = (): string => {
    return JSON.stringify(authState, null, 2);
  };

  return {
    authState,
    loginWithGoogle: authContext.loginWithGoogle,
    logout: authContext.logout,
    copyToken,
    copyGoogleAccessToken,
    getFormattedAuthState,
  };
}
