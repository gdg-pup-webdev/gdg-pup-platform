import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_PAGE_META, AdminPageKey } from "@/lib/constants/pages";

interface AdminPageHeaderProps {
  pageKey: AdminPageKey;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function AdminPageHeader({
  pageKey,
  actions,
  badge,
  className,
  title,
  description,
}: AdminPageHeaderProps) {
  const pageMeta = ADMIN_PAGE_META[pageKey];
  const Icon = pageMeta.icon;
  const resolvedTitle = title || pageMeta.title;
  const resolvedDescription = description || pageMeta.description;

  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.55)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-12 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-teal-400 via-cyan-500 to-emerald-500" />

      <div className="relative z-10 border-b border-gray-100/80 bg-white/70 px-5 py-3 pl-7 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
            Admin Control Center
            <ChevronRight size={12} className="text-teal-500" />
            {pageMeta.sidebarLabel || pageMeta.title}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 bg-linear-to-br from-white via-white to-emerald-50/35 px-5 py-6 pl-7 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-[2.05rem]">
            {resolvedTitle}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            {resolvedDescription}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
              <Icon size={13} />
              Workspace Module
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600">
              Route: {pageMeta.href}
            </span>
            {badge ? <div>{badge}</div> : null}
          </div>
        </div>

        {actions ? (
          <div className="shrink-0 rounded-xl border border-gray-200/90 bg-white/90 p-2 shadow-sm md:self-start">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
