import React from "react";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPageKey } from "@/lib/constants/pages";

interface AdminPageScaffoldProps {
  pageKey: AdminPageKey;
  children: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
}

export function AdminPageScaffold({
  pageKey,
  children,
  actions,
  badge,
  title,
  description,
  className,
  contentClassName,
}: AdminPageScaffoldProps) {
  return (
    <div className={cn("w-full", className)}>
      <AdminPageHeader
        pageKey={pageKey}
        actions={actions}
        badge={badge}
        title={title}
        description={description}
      />
      <div className={cn("space-y-6", contentClassName)}>{children}</div>
    </div>
  );
}
