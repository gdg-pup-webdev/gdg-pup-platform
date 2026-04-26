"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminCardGridProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function AdminCardGrid({ children, className, itemClassName }: AdminCardGridProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-6",
        className,
      )}
    >
      {items.map((child, index) => (
        <div
          key={React.isValidElement(child) && child.key != null ? String(child.key) : index}
          className={cn("w-full max-w-88 justify-self-center", itemClassName)}
        >
          {child}
        </div>
      ))}
    </div>
  );
}