"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { usePathname } from "next/navigation";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import {
  Box,
  Inline,
  Text,
  Button,
  Avatar,
  Stack,
} from "@packages/spark-ui";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

interface NavbarProps {
  transparent?: boolean;
  hideAuth?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  hideAuth = false,
}) => {
  const {  status  } = useAuthContext();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler to close mobile menu and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      
      // Close dropdowns if clicked outside
      if (!(target as HTMLElement).closest('.desktop-dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownLinks = {
    about: [
      { href: "/about", label: "Who is GDG" },
      { href: "/about/team", label: "Our Team" },
      { href: "/about/history", label: "History" },
      { href: "/about/partnership", label: "Partnership" },
      { href: "/about/benefits", label: "Benefits" },
    ],
    community: [
      { href: "/community-showcase", label: "Community Showcase" },
      { href: "/member-showcase", label: "Member Showcase" },
    ],
  };

  const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/products", label: "Products" },
  ];

  const dropdownContainerClassesBase = "absolute left-1/2 -translate-x-1/2 top-full pt-4 min-w-[12rem] transition-all duration-300 ease-out z-50";
  const dropdownContainerClassesOpen = "opacity-100 visible translate-y-0 pointer-events-auto";
  const dropdownContainerClassesClosed = "opacity-0 invisible translate-y-2 pointer-events-none";

  const dropdownInnerClasses = cn(
    "flex flex-col gap-1 p-2 bg-black/80 backdrop-blur-xl",
    "rounded-[16px] shadow-[0px_4px_36px_0px_#FFFFFF40_inset]",
    "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]"
  );
  
  const dropdownItemClasses = cn(
    "block w-full text-left text-white font-bold transition-all p-3 rounded-lg",
    "hover:bg-[linear-gradient(0deg,#57CAFF_0%,#347999_100%)] hover:!text-transparent hover:bg-clip-text"
  );

  return (
    <Box
      className={cn(
        "fixed top-0 left-0 right-0 z-50 md:px-16 md:pt-10 transition-all duration-700 ease-out pointer-events-none",
        isHomePage && !isVisible ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      )}
    >
      <Box
        as="nav"
        className={cn(
          "mx-auto animate-in fade-in zoom-in-95 duration-700 h-22 max-w-7xl md:rounded-[1.875rem]",
          isHomePage && !isVisible ? "pointer-events-none" : "pointer-events-auto",
          "shadow-[0px_4px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040,0px_4px_36px_0px_#FFFFFF40_inset]",
          "bg-black/80 backdrop-blur-xl",
          "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]"
        )}
      >
        <Box className="h-full px-8 md:px-12 lg:px-20 flex items-center">
            <Inline justify="between" align="center" gap="lg" className="w-full h-full">
              {/* Brand */}
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Inline gap="sm" align="center">
                  <Image
                    src={ASSETS.BRANDING.GDG_LOGO_WEBP}
                    alt="GDG Logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                  <h1 className="text-white tracking-tight text-[1.25rem] md:text-[1.5rem] leading-[1.4] font-bold text-nowrap">
                    GDG PUP NEXUS
                  </h1>
                </Inline>
              </Link>

              {/* Navigation */}
              <Inline gap="lg" align="center" className="hidden min-[75rem]:flex h-full">
                <Inline gap="md" align="center" className="h-full">
                  {/* About Dropdown */}
                  <div className="relative flex items-center h-full desktop-dropdown-container">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                      className={cn("flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full", openDropdown === 'about' ? "text-white" : "text-gray-300")}
                    >
                      <Text variant="body" weight="bold" className="text-inherit">About</Text>
                      <svg className={cn("w-4 h-4 transition-transform duration-200", openDropdown === 'about' ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={cn(dropdownContainerClassesBase, openDropdown === 'about' ? dropdownContainerClassesOpen : dropdownContainerClassesClosed)}>
                      <div className={dropdownInnerClasses}>
                        {dropdownLinks.about.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={dropdownItemClasses}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Community Dropdown */}
                  <div className="relative flex items-center h-full desktop-dropdown-container">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'community' ? null : 'community')}
                      className={cn("flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full", openDropdown === 'community' ? "text-white" : "text-gray-300")}
                    >
                      <Text variant="body" weight="bold" className="text-inherit">Community</Text>
                      <svg className={cn("w-4 h-4 transition-transform duration-200", openDropdown === 'community' ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={cn(dropdownContainerClassesBase, openDropdown === 'community' ? dropdownContainerClassesOpen : dropdownContainerClassesClosed)}>
                      <div className={dropdownInnerClasses}>
                        {dropdownLinks.community.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={dropdownItemClasses}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center h-full"
                    >
                      <Text variant="body" weight="bold" className="text-inherit">{link.label}</Text>
                    </Link>
                  ))}
                </Inline>

                {/* Auth Section */}
                {!hideAuth && (
                  <Inline gap="md" align="center">
                    <Link href="/id">
                      <Button variant="colored" subVariant="blue" size="md">
                        Get ID
                      </Button>
                    </Link>

                    {status === "checking" ? (
                      <Box className="w-9 h-9 rounded-full bg-slate-700 animate-pulse"> </Box>
                    ) : status === "loggedin" ? (
                      <Link href="/sparkmates" className="hover:opacity-80 hover:scale-105 transition-all duration-200">
                        <Avatar
                          src={
                            // user.user_metadata?.avatar_url || 
                            ASSETS.AUTH.AVATAR_DEFAULT}
                          // alt={user.user_metadata?.full_name || user.email || "User"}
                          // size="sm"
                          // fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        />
                      </Link>
                    ) : (
                      <Link href="/signin" className="hover:opacity-80 hover:scale-105 transition-all duration-200">
                        <Avatar
                          size="sm"
                          className="opacity-70"
                        />
                      </Link>
                    )}
                  </Inline>
                )}
              </Inline>

              {/* Mobile Menu Button */}
              <Box className="min-[75rem]:hidden" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white p-2 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                  <Box
                    className="absolute right-4 top-full mt-4 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <Stack gap="none">
                      {/* About Section */}
                      <Box className="px-4 py-2 border-b border-slate-700">
                        <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase">
                          About
                        </Text>
                      </Box>
                      {dropdownLinks.about.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-6 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}

                      {/* Community Section */}
                      <Box className="px-4 py-2 border-b border-slate-700 mt-2">
                        <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase">
                          Community
                        </Text>
                      </Box>
                      {dropdownLinks.community.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-6 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}

                      {/* Nav Links */}
                      <Box className="px-4 py-2 border-b border-slate-700 mt-2">
                        <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase">
                          Navigation
                        </Text>
                      </Box>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-6 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}

                      {/* Auth Section */}
                      {!hideAuth && (
                        <Box className="px-4 py-3 mt-2 border-t border-slate-700">
                          <Stack gap="sm">
                            <Link href="/sparkmates" onClick={() => setIsMobileMenuOpen(false)}>
                              <Button variant="colored" subVariant="blue" size="md" >
                                Get ID
                              </Button>
                            </Link>
                            {status === "checking" ? (
                              <Box className="w-full h-10 rounded-lg bg-slate-700 animate-pulse"> </Box>
                            ) : user ? (
                              <Link
                                href="/sparkmates"
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Avatar
                                  src={
                                    // user.user_metadata?.avatar_url || 
                                    ASSETS.AUTH.AVATAR_DEFAULT}
                                  // alt={user.user_metadata?.full_name || user.email || "User"}
                                  // size="sm"
                                  // fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                                />
                                <Stack gap="none">
                                  <Text variant="body-sm" weight="semibold" className="text-white">
                                    {user.user_metadata?.full_name || "User"}
                                  </Text>
                                  <Text variant="body-sm" className="text-gray-400">
                                    View Profile
                                  </Text>
                                </Stack>
                              </Link>
                            ) : (
                              <Link
                                href="/signin"
                                className="block text-center py-2 px-4 rounded-lg border border-gray-500 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Sign In
                              </Link>
                            )}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Inline>
          </Box>
        </Box>
      </Box>
  );
};
