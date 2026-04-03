"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants/links";
import { ADMIN_DASHBOARD_PAGES } from "@/lib/constants/pages";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

const DASHBOARD_CARD_STYLES = [
  {
    gradient: "from-teal-500 to-emerald-500",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    gradient: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    gradient: "from-violet-500 to-fuchsia-500",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminPageScaffold pageKey="dashboard">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ADMIN_DASHBOARD_PAGES.map((page, index) => {
          const Icon = page.icon;
          const cardStyle = DASHBOARD_CARD_STYLES[index % DASHBOARD_CARD_STYLES.length];
          return (
            <Link
              key={page.href}
              href={page.href}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded ${cardStyle.bgLight}`}
              >
                <Icon size={24} className={cardStyle.textColor} />
              </div>

              <h2 className="mb-1 text-lg font-bold text-gray-900">
                {page.sidebarLabel || page.title}
              </h2>
              <p className="mb-4 grow text-sm leading-relaxed text-gray-500">
                {page.description}
              </p>

              <div
                className={`flex items-center gap-1.5 text-sm font-semibold ${cardStyle.textColor}`}
              >
                Manage
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>

              <div
                className={`absolute top-0 left-0 h-1 w-full bg-linear-to-r ${cardStyle.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <a
          href={EXTERNAL_LINKS.LIVE_WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-5 overflow-hidden rounded-sm border-2 border-dashed border-teal-200 bg-teal-50/40 p-6 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-teal-100">
            <Globe size={24} className="text-teal-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">View Live Website</h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Open the public-facing website in a new tab.
            </p>
          </div>

          <ExternalLink
            size={18}
            className="shrink-0 text-teal-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600"
          />

          <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-teal-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </a>
      </div>
    </AdminPageScaffold>
  );
}
