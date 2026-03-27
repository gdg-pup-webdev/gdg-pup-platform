"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  MessageSquareQuote,
  X,
  Globe,
  ExternalLink,
  Files,
  Link2,
  User,
} from "lucide-react";
import { INTERNAL_LINKS, EXTERNAL_LINKS } from "@/lib/constants/links";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: INTERNAL_LINKS.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: INTERNAL_LINKS.PROFILE,
    icon: User,
  },
  {
    label: "Members",
    href: INTERNAL_LINKS.MEMBERS,
    icon: User,
  },
  {
    label: "Teams",
    href: INTERNAL_LINKS.TEAMS,
    icon: Users,
  },
  {
    label: "Files",
    href: INTERNAL_LINKS.FILES,
    icon: Files,
  },
  {
    label: "Team Resources",
    href: INTERNAL_LINKS.TEAM_RESOURCES,
    icon: Link2,
  },
  // {
  //   label: "Portfolios",
  //   href: INTERNAL_LINKS.PORTFOLIOS,
  //   icon: Award,
  // },
  {
    label: "Debug page",
    href: INTERNAL_LINKS.DEBUG_PAGE,
    icon: Award, 
  },
  {
    label: "Roles",
    href: INTERNAL_LINKS.RBAC,
    icon: Award, 
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === INTERNAL_LINKS.DASHBOARD)
      return pathname === INTERNAL_LINKS.DASHBOARD;
    return pathname.startsWith(href);
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
          md:static md:z-auto md:h-auto md:self-stretch md:translate-x-0 md:shadow-none
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
          <p className="mb-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Content
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded px-3 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#0B1F3B] text-white shadow-md shadow-[#0B1F3B]/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition-colors ${
                    active
                      ? "text-[#2FB7A8]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}

          <p className="mb-3 mt-4 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Events
          </p>
          {[
            {
              label: "Nexus Events",
              href: INTERNAL_LINKS.EVENTS,
              icon: Calendar,
            },
            {
              label: "Event Highlights",
              href: INTERNAL_LINKS.EVENT_HIGHLIGHTS,
              icon: MessageSquareQuote,
            },
            {
              label: "Bevy Events",
              href: INTERNAL_LINKS.BEVY_EVENTS,
              icon: MessageSquareQuote,
            },
          ].map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded px-3 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#0B1F3B] text-white shadow-md shadow-[#0B1F3B]/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition-colors ${
                    active
                      ? "text-[#2FB7A8]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}


          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* External link */}
          <p className="mb-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            External
          </p>
          <a
            href={EXTERNAL_LINKS.LIVE_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
          >
            <Globe
              size={20}
              className="shrink-0 text-gray-400 transition-colors group-hover:text-gray-600"
            />
            View Live Website
            <ExternalLink
              size={14}
              className="ml-auto shrink-0 text-gray-300 transition-colors group-hover:text-gray-500"
            />
          </a>
        </nav>
      </aside>
    </>
  );
}
