"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  accentBarClassName?: string;
  accentBarPosition?: "top" | "bottom";
}

export function CardShell({
  className,
  interactive = true,
  accentBarClassName,
  accentBarPosition = "top",
  children,
  ...rest
}: CardShellProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300",
        interactive ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : "",
        className,
      )}
      {...rest}
    >
      {children}
      {accentBarClassName ? (
        <div
          className={cn(
            "absolute left-0 h-1 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            accentBarPosition === "top" ? "top-0" : "bottom-0",
            accentBarClassName,
          )}
        />
      ) : null}
    </div>
  );
}
