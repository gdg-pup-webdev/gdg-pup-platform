"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ListLoadingAccent = "teal" | "blue" | "indigo" | "gray";

const ACCENT_CLASS_MAP: Record<ListLoadingAccent, string> = {
  teal: "text-teal-600",
  blue: "text-blue-600",
  indigo: "text-indigo-600",
  gray: "text-gray-600",
};

interface ListLoadingStateProps {
  message?: string;
  accent?: ListLoadingAccent;
  className?: string;
  iconSize?: number;
}

export function ListLoadingState({
  message,
  accent = "teal",
  className,
  iconSize = 40,
}: ListLoadingStateProps) {
  return (
    <div className={cn("flex h-64 items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={iconSize} className={cn("animate-spin", ACCENT_CLASS_MAP[accent])} />
        {message ? <p className="text-sm font-medium text-gray-500">{message}</p> : null}
      </div>
    </div>
  );
}
