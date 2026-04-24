"use client";

import { useSessionTimeout } from "@/features/authentication/hooks/useSessionTimeout";
import { SessionExpirationWarning } from "@/features/authentication/components/SessionExpirationWarning";
import { SessionExpiredOnLoadModal } from "@/features/authentication/components/SessionExpiredOnLoadModal";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

/**
 * Wrapper component that integrates session timeout management
 * Must be placed inside AuthContextProvider
 */
export const SessionManagementWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status } = useAuthContext();
  
  // Initialize session timeout hook
  useSessionTimeout();

  return (
    <>
      {children}
      {/* Show warning when authenticated */}
      {status === "authenticated" && <SessionExpirationWarning />}
      {/* Show session expired modal if it was detected on load */}
      <SessionExpiredOnLoadModal />
    </>
  );
};
