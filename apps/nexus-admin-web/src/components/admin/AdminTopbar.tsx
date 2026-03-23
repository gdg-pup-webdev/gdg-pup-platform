"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, User, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/features/authentication/store/useAuthStore";
import { useRouter } from "next/navigation";
import { INTERNAL_LINKS, EXTERNAL_LINKS } from "@/lib/constants/links";
import { ASSETS } from "@/lib/constants/assets";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clearToken = useAuthStore((state) => state.clearToken);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      clearToken();
      router.push(INTERNAL_LINKS.LOGIN);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1F3B] shadow-lg shadow-black/10">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-sm p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <Link href={INTERNAL_LINKS.HOME} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <img
              src={ASSETS.BRANDING.GDG_LOGO_SVG}
              alt="GDG PUP Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded px-3 py-2 transition-colors hover:bg-white/10"
            aria-label="User menu"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2F80ED] to-[#2FB7A8] shadow-inner">
              <User size={18} className="text-white" />
            </div>
            <ChevronDown
              size={14}
              className={`text-white/50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
              <Link
                href={EXTERNAL_LINKS.LIVE_WEBSITE}
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <ExternalLink size={16} className="text-gray-400" />
                Landing Page
              </Link>
              <div className="mx-3 border-t border-gray-100" />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <LogOut size={16} className="text-gray-400" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

