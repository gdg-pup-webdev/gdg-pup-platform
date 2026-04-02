"use client";

import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/constants/links";
import { ASSETS } from "@/lib/constants/assets";

export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0B1F3B] text-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-8 md:px-8">
        {/* Main row */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          {/* Left: Brand */}
          <div>
            <Link href={INTERNAL_LINKS.HOME} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <img
                src={ASSETS.BRANDING.GDG_LOGO_SVG}
                alt="GDG PUP Logo"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Content management system for GDG PUP.
            </p>
          </div>


        </div>

        {/* Divider + bottom */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            &copy; {year} GDG PUP. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Google Developer Groups On Campus - Polytechnic University of the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
