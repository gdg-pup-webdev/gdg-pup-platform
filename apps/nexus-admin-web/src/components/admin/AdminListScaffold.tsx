"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminListScaffoldProps {
  className?: string;
  leading?: React.ReactNode;
  search?: React.ReactNode;
  filters?: React.ReactNode;
  content: React.ReactNode;
  pagination?: React.ReactNode;
  controlsClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

export function AdminListScaffold({
  className,
  leading,
  search,
  filters,
  content,
  pagination,
  controlsClassName,
  contentClassName,
  children,
}: AdminListScaffoldProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {leading ? <div className="space-y-4">{leading}</div> : null}

      {search || filters ? (
        <div className={cn("space-y-4", controlsClassName)}>
          {search}
          {filters}
        </div>
      ) : null}

      <div className={cn("space-y-4", contentClassName)}>{content}</div>

      {pagination ? <div className="pt-1">{pagination}</div> : null}

      {children}
    </div>
  );
}