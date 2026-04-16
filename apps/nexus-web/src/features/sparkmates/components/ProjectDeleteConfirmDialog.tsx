"use client";

import Image from "next/image";
import { Button, Modal, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";

interface ProjectDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

export const ProjectDeleteConfirmDialog = ({
  open,
  onOpenChange,
  projectTitle,
  onConfirm,
  isPending = false,
}: ProjectDeleteConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) {
          return;
        }
        onOpenChange(nextOpen);
      }}
      scrollBehavior="inside"
      size="sm"
      className="bg-transparent border-none p-0 shadow-none! isolate max-w-[95vw] sm:max-w-sm"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 border border-red-500/20 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-5">
          <div className="flex flex-col items-center text-center gap-2">
            <Image
              src={ASSETS.SPARKY_POINTS.CIRBY_DENIED}
              alt="Cirby crying"
              width={96}
              height={96}
              className="object-contain"
              priority
            />

            <Text variant="heading-6" weight="bold" className="text-white">
              Delete Project
            </Text>

            <Text variant="body-sm" className="text-zinc-400 max-w-xs">
              This action is <span className="text-red-400 font-semibold">permanent and irreversible</span>.
              The project and its uploaded images will be removed.
            </Text>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3">
            <Text variant="body-sm" className="text-red-300">
              Are you sure you want to delete <span className="font-semibold">{projectTitle}</span>?
            </Text>
          </div>

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
              onClick={() => {
                void onConfirm();
              }}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Yes, Delete Project"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};