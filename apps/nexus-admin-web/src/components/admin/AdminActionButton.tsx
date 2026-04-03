"use client";

import React from "react";
import { cn } from "@/lib/utils";

type AdminActionButtonVariant =
  | "brand"
  | "brandOutline"
  | "teal"
  | "tealOutline"
  | "danger"
  | "neutral"
  | "dark";

type AdminActionButtonSize = "sm" | "md" | "lg";

interface AdminActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminActionButtonVariant;
  size?: AdminActionButtonSize;
}

const VARIANT_CLASS_MAP: Record<AdminActionButtonVariant, string> = {
  brand: "bg-[#0B1F3B] text-white hover:bg-[#0B1F3B]/90",
  brandOutline:
    "border border-[#0B1F3B] text-[#0B1F3B] hover:bg-gray-50",
  teal: "bg-teal-600 text-white hover:bg-teal-700",
  tealOutline: "border border-teal-600 text-teal-600 hover:bg-teal-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  neutral: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  dark: "bg-gray-900 text-white hover:bg-gray-800",
};

const SIZE_CLASS_MAP: Record<AdminActionButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-sm",
};

export function AdminActionButton({
  variant = "brand",
  size = "md",
  className,
  type = "button",
  ...rest
}: AdminActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASS_MAP[variant],
        SIZE_CLASS_MAP[size],
        className,
      )}
      {...rest}
    />
  );
}
