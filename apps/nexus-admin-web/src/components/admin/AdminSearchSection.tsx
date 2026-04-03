"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SearchInput, SearchInputAccent } from "@/components/ui/SearchInput";

interface AdminSearchSectionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  accent?: SearchInputAccent;
  actions?: React.ReactNode;
  className?: string;
  searchContainerClassName?: string;
  inputClassName?: string;
  rightSlot?: React.ReactNode;
}

export function AdminSearchSection({
  value,
  onValueChange,
  placeholder = "Search...",
  accent = "teal",
  actions,
  className,
  searchContainerClassName,
  inputClassName,
  rightSlot,
  ...rest
}: AdminSearchSectionProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-3 shadow-sm", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          accent={accent}
          rightSlot={rightSlot}
          containerClassName={cn("w-full", actions ? "md:max-w-md" : "", searchContainerClassName)}
          inputClassName={cn("border-gray-200", inputClassName)}
          {...rest}
        />

        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
