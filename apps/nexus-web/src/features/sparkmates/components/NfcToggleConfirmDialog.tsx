"use client";

import { Modal, Button, Text } from "@packages/spark-ui";
import { useToggleNfcVisibility } from "../hooks/useToggleNfcVisibility";

interface NfcToggleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gdgId: string;
  /** Current is_public state — the dialog will ask to flip it */
  currentIsPublic: boolean;
}

export const NfcToggleConfirmDialog = ({
  open,
  onOpenChange,
  gdgId,
  currentIsPublic,
}: NfcToggleConfirmDialogProps) => {
  const { mutateAsync: toggle, isPending } = useToggleNfcVisibility(gdgId);

  // We're flipping the current state
  const nextState = !currentIsPublic;

  const handleConfirm = async () => {
    await toggle(nextState);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="sm"
      className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-sm"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-5">
          {/* Icon */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A66FF]/15 border border-[#1A66FF]/30">
              <svg
                className="h-7 w-7 text-[#4285F4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>
            <Text variant="heading-6" weight="bold" className="text-white">
              {nextState ? "Make NFC Card Public" : "Make NFC Card Private"}
            </Text>
            <Text variant="body-sm" className="text-zinc-400 max-w-xs">
              {nextState
                ? "Your NFC card and profile will be publicly visible to anyone who scans it."
                : "Your NFC card and profile will be hidden from public view."}
            </Text>
          </div>

          {/* Confirmation note */}
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Text variant="body-sm" className="text-zinc-300">
              Are you sure you want to turn NFC visibility{" "}
              <span className={nextState ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                {nextState ? "ON" : "OFF"}
              </span>
              ?
            </Text>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
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
              subVariant="blue"
              type="button"
              className="h-auto py-2 px-5"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
