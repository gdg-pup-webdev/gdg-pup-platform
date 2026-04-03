"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalActionTone = "primary" | "danger" | "neutral";

export interface ModalActionItem {
  key: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  tone?: ModalActionTone;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
}

interface ModalActionRowProps {
  actions: ModalActionItem[];
  className?: string;
}

const TONE_CLASS_MAP: Record<ModalActionTone, string> = {
  primary: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
  neutral: "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

export function ModalActionRow({ actions, className }: ModalActionRowProps) {
  if (!actions.length) return null;

  return (
    <div className={cn("flex flex-wrap justify-end gap-2 border-b border-gray-50 pb-4", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        const tone = action.tone || "primary";
        const isBusy = Boolean(action.isLoading);

        return (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || isBusy}
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              TONE_CLASS_MAP[tone],
            )}
          >
            {isBusy ? (
              <Loader2 size={14} className="animate-spin" />
            ) : Icon ? (
              <Icon size={14} />
            ) : null}
            <span>{isBusy && action.loadingLabel ? action.loadingLabel : action.label}</span>
          </button>
        );
      })}
    </div>
  );
}