"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/providers/AuthProvider";
import { 
  Box, 
  Inline, 
  Text, 
  Button, 
  Avatar, 
  Stack,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@packages/spark-ui";

interface NavbarProps {
  transparent?: boolean;
  hideAuth?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  hideAuth = false,
}) => {
  const { user, status } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  // Click outside handler to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
    debugging: [
      { href: "/debugging", label: "Debug Tools" },
      { href: "/debugging/auth", label: "Auth Debug" },
    ],
  };

  const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/products", label: "Products" },
  ];

  return (
    <Box 
      className="fixed top-0 left-0 right-0 z-50 md:px-16 md:pt-10 pointer-events-none transition-all duration-700 ease-out"
      // style={{
      //   opacity: isVisible ? 1 : 0,
      //   transform: isVisible ? "translateY(0) scale(1)" : "translateY(-2rem) scale(0.95)",
      // }}
    >
      <Box
        className="mx-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-700 bg-[linear-gradient(90deg,#EA4335_0%,#F9AB00_50%,#97AA2A_75%,#4285F4_100%)] md:p-0.5 max-w-7xl md:rounded-4xl shadow-[0px_4px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040]"
      >
        <Box
          as="nav"
          className="bg-[linear-gradient(90deg,#000000_0%,#414141_100%)]! h-22! md:rounded-[1.875rem]! shadow-[0px_4px_36px_0px_#FFFFFF40_inset]!"
        >
          <Box className="h-full px-8 md:px-12 lg:px-20 flex items-center">
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
                  <h1 className="text-white tracking-tight text-[1.25rem] md:text-[1.5rem] leading-[1.4] font-bold text-nowrap">
                    GDG PUP NEXUS
                  </h1>
                </Inline>
              </Link>

              {/* Navigation */}
              <Inline gap="lg" align="center" className="hidden min-[75rem]:flex">
                <Inline gap="md" align="center">
                  {/* About Dropdown */}
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer">
                        <Text variant="body" weight="bold" className="text-inherit">About</Text>
                        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownTrigger>
                    <DropdownContent>
                      {dropdownLinks.about.map((link) => (
                        <DropdownItem
                          key={link.href}
                          href={link.href}
                          linkComponent={Link}
                        >
                          {link.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>

                  {/* Community Dropdown */}
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer">
                        <Text variant="body" weight="bold" className="text-inherit">Community</Text>
                        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownTrigger>
                    <DropdownContent size="md">
                      {dropdownLinks.community.map((link) => (
                        <DropdownItem
                          key={link.href}
                          href={link.href}
                          linkComponent={Link}
                        >
                          {link.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>

                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors py-2"
                    >
                      <Text variant="body" weight="bold" className="text-inherit">{link.label}</Text>
                    </Link>
                  ))}

                  {/* Debugging Dropdown */}
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer">
                        <Text variant="body" weight="bold" className="text-inherit">🛠️</Text>
                        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownTrigger>
                    <DropdownContent>
                      {dropdownLinks.debugging.map((link) => (
                        <DropdownItem
                          key={link.href}
                          href={link.href}
                          linkComponent={Link}
                        >
                          {link.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </Inline>

                {/* Auth Section */}
                {!hideAuth && (
                  <Inline gap="md" align="center">
                    <Link href="/id">
                      <Button variant="default" size="md">
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
                            <Link href="/id" onClick={() => setIsMobileMenuOpen(false)}>
                              <Button variant="default" size="md" >
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
