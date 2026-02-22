"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/providers/AuthProvider";
import { Box, Inline, Text, Button, Avatar, Stack } from "@packages/spark-ui";

interface NavbarProps {
  transparent?: boolean;
  hideAuth?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  hideAuth = false,
}) => {
  const { user, status } = useAuthContext();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isDebuggingOpen, setIsDebuggingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const debuggingRef = useRef<HTMLDivElement>(null);
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

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
      if (communityRef.current && !communityRef.current.contains(event.target as Node)) {
        setIsCommunityOpen(false);
      }
      if (debuggingRef.current && !debuggingRef.current.contains(event.target as Node)) {
        setIsDebuggingOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownLinks = {
    about: [
      { href: "/about/who-is-gdg", label: "Who is GDG" },
      { href: "/about/team", label: "Our Team" },
      { href: "/about/history", label: "History" },
      { href: "/about/partnership", label: "Partnership" },
      { href: "/about/gdg-on-top", label: "GDG on TOP" },
    ],
    community: [
      { href: "/community/showcase", label: "Community Showcase" },
      { href: "/community/members", label: "Member Showcase" },
    ],
    debugging: [
      { href: "/debugging", label: "Debug Tools" },
      { href: "/debugging/auth", label: "Auth Debug" },
    ],
  };

  const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/leaderboards", label: "Leaderboards" },
    { href: "/products", label: "Products" },
  ];

  return (
    <Box 
      className="fixed top-0 left-0 right-0 z-50 px-16 lg:px-20 pt-10 pointer-events-none transition-all duration-700 ease-out"
      // style={{
      //   opacity: isVisible ? 1 : 0,
      //   transform: isVisible ? "translateY(0) scale(1)" : "translateY(-2rem) scale(0.95)",
      // }}
    >
      <Box
        style={{
          background: "linear-gradient(90deg, #EA4335 0%, #F9AB00 50%, #97AA2A 75%, #4285F4 100%)",
          padding: "2px",
          maxWidth: "80rem",
          borderRadius: "2rem",
          boxShadow: "0px 4px 4px 0px #00000040, 0px 4px 46.1px 0px #00000040",
        }}
        className="mx-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-700"
      >
        <Box
          as="nav"
          style={{
            background: "linear-gradient(90deg, #000000 0%, #414141 100%)",
            height: "5.5rem",
            borderRadius: "1.875rem",
            boxShadow: "0px 4px 36px 0px #FFFFFF40 inset",
          }}
        >
          <Box className="h-full px-12 lg:px-20 flex items-center">
            <Inline justify="between" align="center" gap="lg" className="w-full">
              {/* Brand */}
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Inline gap="sm" align="center">
                  <Image
                    src="/images/logos/GDG.webp"
                    alt="GDG Logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                  <Text variant="heading-6" weight="bold" className="text-white tracking-tight">
                    GDG PUP NEXUS
                  </Text>
                </Inline>
              </Link>

              {/* Navigation */}
              <Inline gap="lg" align="center" className="hidden md:flex">
                <Inline gap="md" align="center">
                  {/* About Dropdown */}
                  <Box className="relative" ref={aboutRef}>
                    <button
                      onClick={() => {
                        setIsAboutOpen(!isAboutOpen);
                        setIsCommunityOpen(false);
                        setIsDebuggingOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
                    >
                      <Text variant="body" className="text-inherit">About</Text>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isAboutOpen && (
                      <Box className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Stack gap="none">
                          {dropdownLinks.about.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                              onClick={() => setIsAboutOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Community Dropdown */}
                  <Box className="relative" ref={communityRef}>
                    <button
                      onClick={() => {
                        setIsCommunityOpen(!isCommunityOpen);
                        setIsAboutOpen(false);
                        setIsDebuggingOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
                    >
                      <Text variant="body" className="text-inherit">Community</Text>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isCommunityOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isCommunityOpen && (
                      <Box className="absolute left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Stack gap="none">
                          {dropdownLinks.community.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                              onClick={() => setIsCommunityOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors py-2"
                    >
                      <Text variant="body" className="text-inherit">{link.label}</Text>
                    </Link>
                  ))}

                  {/* Debugging Dropdown */}
                  <Box className="relative" ref={debuggingRef}>
                    <button
                      onClick={() => {
                        setIsDebuggingOpen(!isDebuggingOpen);
                        setIsAboutOpen(false);
                        setIsCommunityOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
                    >
                      <Text variant="body" className="text-inherit">🛠️</Text>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isDebuggingOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDebuggingOpen && (
                      <Box className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Stack gap="none">
                          {dropdownLinks.debugging.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                              onClick={() => setIsDebuggingOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Inline>

                {/* Auth Section */}
                {!hideAuth && (
                  <Inline gap="md" align="center">
                    <Link href="#">
                      <Button variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                        Get ID
                      </Button>
                    </Link>

                    {status === "checking" ? (
                      <Box className="w-9 h-9 rounded-full bg-slate-700 animate-pulse"> </Box>
                    ) : user ? (
                      <Link href={`/id/${user.id}`} className="hover:opacity-80 hover:scale-105 transition-all duration-200">
                        <Avatar
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.full_name || user.email || "User"}
                          size="sm"
                          fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        />
                      </Link>
                    ) : (
                      <Link href="/signin" className="hover:opacity-80 hover:scale-105 transition-all duration-200">
                        <Avatar
                          fallback="?"
                          size="sm"
                          className="opacity-70 border-2 border-dashed border-gray-500"
                        />
                      </Link>
                    )}
                  </Inline>
                )}
              </Inline>

              {/* Mobile Menu Button */}
              <Box className="md:hidden" ref={mobileMenuRef}>
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

                      {/* Debugging Section */}
                      <Box className="px-4 py-2 border-b border-slate-700 mt-2">
                        <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase">
                          🛠️ Debug
                        </Text>
                      </Box>
                      {dropdownLinks.debugging.map((link) => (
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
                            <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>
                              <Button variant="primary" size="md" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                                Get ID
                              </Button>
                            </Link>
                            {status === "checking" ? (
                              <Box className="w-full h-10 rounded-lg bg-slate-700 animate-pulse"> </Box>
                            ) : user ? (
                              <Link 
                                href={`/id/${user.id}`} 
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Avatar
                                  src={user.user_metadata?.avatar_url}
                                  alt={user.user_metadata?.full_name || user.email || "User"}
                                  size="sm"
                                  fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
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
    </Box>
  );
};
