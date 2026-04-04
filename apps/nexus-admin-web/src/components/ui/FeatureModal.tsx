"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const SIZE_CLASS_MAP: Record<FeatureModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-3xl",
  "2xl": "max-w-2xl",
  full: "max-w-5xl",
};

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: FeatureModalSize;
  className?: string;
  bodyClassName?: string;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

export function FeatureModal({
  isOpen,
  onClose,
  title,
  children,
  size = "2xl",
  className,
  bodyClassName,
  closeOnBackdropClick = true,
  showCloseButton = true,
}: FeatureModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      <div
        className={cn(
          "relative w-full min-w-80 overflow-hidden rounded-sm bg-white shadow-2xl sm:min-w-112.5",
          SIZE_CLASS_MAP[size],
          className,
        )}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={cn("max-h-[85vh] overflow-y-auto p-6", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}
