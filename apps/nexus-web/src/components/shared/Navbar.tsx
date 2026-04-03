"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { Box, Inline, Text, Button, Avatar, Stack } from "@packages/spark-ui";
import {
  STATUS,
  useAuthContext,
} from "@/features/authentication/store/useAuthStore";

interface NavbarProps {
  transparent?: boolean;
  hideAuth?: boolean;
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  excludeRefs: React.RefObject<HTMLElement | null>[] = []
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) return;

      // Check if any of the excluded refs contain the target
      const isExcluded = excludeRefs.some(
        (exRef) => exRef.current && exRef.current.contains(target)
      );

      if (!isExcluded) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
}

const NavbarAvatarWidget = () => {
  const { decodedToken: user, status } = useAuthContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  const optionsLoggedIn = [
    { label: "View Profile", href: "/sparkmates" },
    { label: "Sign Out", href: "/signout" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {status === "checking" ? (
        <Box className="w-9 h-9 rounded-full bg-slate-700 animate-pulse"> </Box>
      ) : status === STATUS.AUTHENTICATED ? (
        <div
          className="relative flex justify-center items-center group transition-all duration-200 cursor-pointer"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          {user?.memberInfo.avatarUrl ? (
            <Avatar
              className="group-hover:scale-105 transition-all duration-200"
              src={user?.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT}
            />
          ) : (
            <div className="w-9 h-9 flex justify-center items-center text-black font-extrabold aspect-square rounded-full bg-gray-400 group-hover:scale-105 transition-all duration-200">
              {user?.memberInfo.firstName?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>
          )}

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bg-black border-white/20 text-white border rounded-2xl p-2 top-full right-0 mt-2 shadow-xl backdrop-blur-xl z-[110]"
              >
                {optionsLoggedIn.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="block w-full whitespace-nowrap p-3 rounded-lg hover:bg-white/10 transition-all duration-100 font-bold"
                    onClick={() => setOpenDropdown(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          href="/signin"
          className="relative flex justify-center items-center group hover:opacity-80 hover:scale-105 transition-all duration-200"
        >
          <Avatar
            className="group-hover:scale-105 transition-all duration-200"
            src={ASSETS.AUTH.AVATAR_DEFAULT}
          />
        </Link>
      )}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  hideAuth = false,
}) => {
  const { status, decodedToken } = useAuthContext();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(mobileMenuRef, () => setIsMobileMenuOpen(false), [mobileToggleRef]);
  useOutsideClick(desktopDropdownRef, () => setOpenDropdown(null));

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

  const dropdownItemClasses = cn(
    "block w-full text-left text-white font-bold transition-all p-3 rounded-lg",
    "hover:bg-[linear-gradient(0deg,#57CAFF_0%,#347999_100%)] hover:!text-transparent hover:bg-clip-text"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 md:px-16 md:pt-10 transition-all duration-700 pointer-events-none",
        (isMobileMenuOpen || !isHomePage || pathname !== "/") ? "pointer-events-auto" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-0 pointer-events-auto">
        <Box
          as="nav"
          className={cn(
            "h-16 md:h-22 md:rounded-[1.875rem] rounded-[1rem]",
            "shadow-[0px_4px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040,0px_4px_36px_0px_#FFFFFF40_inset]",
            "bg-black/80 backdrop-blur-xl",
            "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]"
          )}
        >
          <Box className="h-full px-6 md:px-12 lg:px-20 flex items-center">
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
                  <h1 className="text-white tracking-tight text-[1.125rem] md:text-[1.5rem] leading-[1.4] font-bold whitespace-nowrap">
                    GDG PUP NEXUS
                  </h1>
                </Inline>
              </Link>

              {/* Desktop Navigation */}
              <Inline gap="lg" align="center" className="hidden min-[75rem]:flex h-full" ref={desktopDropdownRef}>
                <Inline gap="md" align="center" className="h-full">
                  {/* About Dropdown */}
                  <div className="relative flex items-center h-full">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
                      className={cn("flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full", openDropdown === "about" ? "text-white" : "text-gray-300")}
                    >
                      <Text variant="body" weight="bold" className="text-inherit">About</Text>
                      <svg className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "about" ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {openDropdown === "about" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-4 min-w-[14rem] z-[110]"
                        >
                          <div className="flex flex-col gap-1 p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-[16px] shadow-2xl relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]">
                            {dropdownLinks.about.map((link) => (
                              <Link key={link.href} href={link.href} className={dropdownItemClasses} onClick={() => setOpenDropdown(null)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Community Dropdown */}
                  <div className="relative flex items-center h-full">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "community" ? null : "community")}
                      className={cn("flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full", openDropdown === "community" ? "text-white" : "text-gray-300")}
                    >
                      <Text variant="body" weight="bold" className="text-inherit">Community</Text>
                      <svg className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "community" ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {openDropdown === "community" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-4 min-w-[14rem] z-[110]"
                        >
                          <div className="flex flex-col gap-1 p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-[16px] shadow-2xl relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]">
                            {dropdownLinks.community.map((link) => (
                              <Link key={link.href} href={link.href} className={dropdownItemClasses} onClick={() => setOpenDropdown(null)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center h-full">
                      <Text variant="body" weight="bold" className="text-inherit">{link.label}</Text>
                    </Link>
                  ))}
                </Inline>

                {/* Desktop Auth */}
                {!hideAuth && (
                  <Inline gap="md" align="center">
                    <Link href="/id">
                      <Button variant="colored" subVariant="blue" size="md">Get ID</Button>
                    </Link>
                    <NavbarAvatarWidget />
                  </Inline>
                )}
              </Inline>

              {/* Mobile Menu Toggle */}
              <Box className="min-[75rem]:hidden" ref={mobileToggleRef}>
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
              </Box>
            </Inline>
          </Box>
        </Box>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-full z-[100]"
            >
              <div
                className={cn(
                  "w-full max-h-[calc(100svh-140px)] flex flex-col",
                  "bg-black/95 backdrop-blur-2xl rounded-[20px] border border-white/10 shadow-2xl overflow-hidden",
                  "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]"
                )}
              >
                <div className="overflow-y-auto scrollbar-hide py-4 px-2 flex-1">
                  <Stack gap="none">
                    <Box className="px-5 py-3 border-b border-white/10">
                      <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase tracking-wider">About</Text>
                    </Box>
                    {dropdownLinks.about.map((link) => (
                      <Link key={link.href} href={link.href} className="block px-8 py-4 text-base font-bold text-gray-200 transition-all hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}

                    <Box className="px-5 py-3 border-b border-white/10 mt-2">
                      <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase tracking-wider">Community</Text>
                    </Box>
                    {dropdownLinks.community.map((link) => (
                      <Link key={link.href} href={link.href} className="block px-8 py-4 text-base font-bold text-gray-200 transition-all hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}

                    <Box className="px-5 py-3 border-b border-white/10 mt-2">
                      <Text variant="body-sm" weight="semibold" className="text-gray-400 uppercase tracking-wider">Navigation</Text>
                    </Box>
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block px-8 py-4 text-base font-bold text-gray-200 transition-all hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}

                    {!hideAuth && (
                      <Box className="px-5 py-6 mt-4 border-t border-white/10">
                        <Stack gap="md">
                          <Link href="/id" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                            <Button variant="colored" subVariant="blue" size="md" className="w-full">Get ID</Button>
                          </Link>
                          {status === STATUS.AUTHENTICATED ? (
                            <Link href="/sparkmates" className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                              <Avatar src={decodedToken?.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT} />
                              <Stack gap="none">
                                <Text weight="bold" className="text-white">{decodedToken?.memberInfo.firstName || "User"}</Text>
                                <Text variant="body-sm" className="text-gray-400">View Profile</Text>
                              </Stack>
                            </Link>
                          ) : (
                            <Link href="/signin" className="block w-full text-center py-4 px-4 rounded-xl border border-white/20 text-base font-bold text-gray-200 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                              Sign In
                            </Link>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
