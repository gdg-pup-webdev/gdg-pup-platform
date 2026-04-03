"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/admin/Pagination";

type PaginationProps = React.ComponentProps<typeof Pagination>;

interface AdminPaginationSectionProps extends PaginationProps {
  className?: string;
}

export function AdminPaginationSection({ className, ...paginationProps }: AdminPaginationSectionProps) {
  return (
    <div className={cn("rounded-sm border border-gray-200 bg-white px-4 py-3", className)}>
      <Pagination {...paginationProps} />
    </div>
  );
}
