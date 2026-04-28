"use client";

import { useAuthContext } from "../store/useAuthStore";
import { Modal, Button, Text, Stack } from "@packages/spark-ui";
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

  return (
    <Modal 
      open={sessionExpiredOnLoad} 
      onOpenChange={(open) => !open && clearSessionExpiredOnLoad()} 
      size="md" 
      className="!bg-[#0a162a] border border-white/10 !p-0"
    >
      <Stack gap="md" className="p-8">
        <div className="text-center">
          <Text variant="heading-3" className="font-bold text-white mb-2">
            Session Expired
          </Text>
          <Text variant="body-sm" className="text-white/70 mb-6">
            Your previous session has expired. Please log in again to continue.
          </Text>
        </div>

        <Stack gap="sm">
          <Button
            variant="default"
            onClick={handleLoginAgain}
            className="w-full !bg-gradient-to-t !from-[#2b7fff] !to-[#162456] !border-none !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)]"
          >
            Log In Again
          </Button>
          <Button
            variant="ghost"
            onClick={clearSessionExpiredOnLoad}
            className="w-full text-white/70 hover:text-white"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
