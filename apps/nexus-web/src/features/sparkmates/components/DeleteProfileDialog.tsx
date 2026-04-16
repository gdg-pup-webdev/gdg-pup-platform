"use client";

import { Modal, Button, Text } from "@packages/spark-ui";
import { useDeleteProfile } from "../hooks/useDeleteProfile";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

interface DeleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteProfileDialog = ({
  open,
  onOpenChange,
}: DeleteProfileDialogProps) => {
  const { decodedToken } = useAuthContext();
  const { mutateAsync: deleteProfile, isPending } = useDeleteProfile();

  const handleConfirm = async () => {
    const gdgId = decodedToken?.memberInfo.gdgId;
    if (!gdgId) return;
    await deleteProfile(gdgId);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="sm"
      className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-sm"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 border border-red-500/20 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            {/* Warning icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
              <svg
                className="h-7 w-7 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <Text variant="heading-6" weight="bold" className="text-white">
              Delete Account
            </Text>
            <Text variant="body-sm" className="text-zinc-400 max-w-xs">
              This action is <span className="text-red-400 font-semibold">permanent and irreversible</span>. Your account, profile, and all associated data will be deleted. You will be logged out immediately.
            </Text>
          </div>

          {/* Confirmation box */}
          <div className="rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3">
            <Text variant="body-sm" className="text-red-300">
              Are you absolutely sure you want to delete your account?
            </Text>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              type="button"
              className="h-auto py-2 px-5"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="colored"
              subVariant="red"
              type="button"
              className="h-auto py-2 px-5 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Yes, Delete Account"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
