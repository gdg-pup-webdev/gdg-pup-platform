"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ListErrorState({
  title,
  message = "An unexpected error occurred.",
  onRetry,
  retryLabel = "Try Again",
  className,
}: ListErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center", className)}>
      <AlertCircle size={48} className="mb-4 text-red-500" />
      <h3 className="text-lg font-bold text-red-900">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-sm bg-red-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
