"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchInputAccent = "teal" | "blue" | "indigo" | "gray";

const ACCENT_CLASS_MAP: Record<SearchInputAccent, string> = {
  teal: "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
  blue: "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
  indigo: "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
  gray: "focus:border-gray-500 focus:ring-1 focus:ring-gray-500",
};

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
  accent?: SearchInputAccent;
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  rightSlot?: React.ReactNode;
}

export function SearchInput({
  value,
  onValueChange,
  accent = "teal",
  containerClassName,
  inputClassName,
  iconClassName,
  rightSlot,
  placeholder = "Search...",
  ...rest
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search className={cn("pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400", iconClassName)} />
      <input
        {...rest}
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-sm border border-gray-200 bg-white py-2.5 pl-10 text-sm outline-none transition-all",
          rightSlot ? "pr-10" : "pr-4",
          ACCENT_CLASS_MAP[accent],
          inputClassName,
        )}
      />
      {rightSlot ? <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div> : null}
    </div>
  );
}
