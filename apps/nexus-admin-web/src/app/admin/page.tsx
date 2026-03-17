"use client";

import Link from "next/link";
import { Users, Award, MessageSquareQuote, ArrowRight, ExternalLink, Globe } from "lucide-react";
import { INTERNAL_LINKS, EXTERNAL_LINKS } from "@/lib/constants/links";

const SECTIONS = [
  {
    title: "Teams",
    description: "Manage GDG PUP teams and members",
    href: INTERNAL_LINKS.TEAMS,
    icon: Users,
    gradient: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    title: "Debug page",
    description: "System diagnostics and health checks",
    href: INTERNAL_LINKS.DEBUG_PAGE,
    icon: Award,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  }, 
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Welcome back. Manage your site content from here.
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded ${section.bgLight}`}
              >
                <Icon size={24} className={section.textColor} />
              </div>

              {/* Content */}
              <h2 className="mb-1 text-lg font-bold text-gray-900">
                {section.title}
              </h2>
              <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-500">
                {section.description}
              </p>

              {/* Action link */}
              <div
                className={`flex items-center gap-1.5 text-sm font-semibold ${section.textColor}`}
              >
                Manage
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>

              {/* Decorative gradient bar at top */}
              <div
                className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${section.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </Link>
          );
        })}
      </div>

      {/* View Live Website */}
      <div className="mt-8">
        <a
          href={EXTERNAL_LINKS.LIVE_WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-5 overflow-hidden rounded-sm border-2 border-dashed border-teal-200 bg-teal-50/40 p-6 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg"
        >
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-teal-100">
            <Globe size={24} className="text-teal-600" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">View Live Website</h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Open the public-facing website in a new tab.
            </p>
          </div>

          {/* External link indicator */}
          <ExternalLink
            size={18}
            className="shrink-0 text-teal-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600"
          />

          {/* Decorative gradient bar at top */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  );
}
