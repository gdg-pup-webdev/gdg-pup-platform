"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex w-full max-w-7xl mx-auto items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-['Google_Sans',sans-serif] text-xs text-white/80 backdrop-blur-xl sm:px-5 sm:text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden className="text-white/40">
                /
              </span>
            )}
            {isLast || !item.href ? (
              <span className="font-medium text-white">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
