"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { FeatureModal } from "@/components/ui/FeatureModal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <FeatureModal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-sm bg-red-50 p-4">
          <div className="shrink-0 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="text-sm text-red-700 leading-relaxed">{description}</div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 rounded-sm bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {isConfirming ? <Loader2 size={16} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </FeatureModal>
  );
}
