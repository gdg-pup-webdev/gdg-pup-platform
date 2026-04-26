"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import {
  ADMIN_EXTERNAL_NAV_ITEMS,
  ADMIN_PAGE_META,
  ADMIN_SIDEBAR_SECTIONS,
} from "@/lib/constants/pages";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, matchMode?: "exact" | "prefix") => {
    if ((matchMode || "prefix") === "exact") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col shrink-0
          border-r border-gray-200/80 bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          md:sticky md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 md:hidden">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {ADMIN_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
            <div key={section.key} className={sectionIndex === 0 ? "" : "pt-3"}>
              <p className="mb-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                {section.label}
              </p>

              {section.items.map((pageKey) => {
                const page = ADMIN_PAGE_META[pageKey];
                if (page.sidebarVisible === false) {
                  return null;
                }

                const Icon = page.icon;
                const active = isActive(page.href, page.matchMode);
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "border-[#0B1F3B]/20 bg-[#0B1F3B] text-white shadow-md shadow-[#0B1F3B]/20"
                        : "border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-[#2FB7A8]" : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    <span className="truncate">{page.sidebarLabel || page.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="my-4 border-t border-gray-200" />

          <p className="mb-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            External
          </p>
          {ADMIN_EXTERNAL_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              >
                <Icon size={18} className="shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
                {item.label}
                <ExternalLink
                  size={14}
                  className="ml-auto shrink-0 text-gray-300 transition-colors group-hover:text-gray-500"
                />
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
