"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { Box, Inline, Text, Button, Avatar, Stack } from "@packages/spark-ui";
import {
  STATUS,
  useAuthContext,
} from "@/features/authentication/store/useAuthStore";

// import { MemberInfo } from "../../../../nexus-api/src/v1/modules/authentication/domain/TokenPayload";

interface NavbarProps {
  transparent?: boolean;
  hideAuth?: boolean;
}

const dropdownContainerClassesBase =
  "absolute left-1/2 -translate-x-1/2 top-full pt-4 min-w-[12rem] transition-all duration-300 ease-out z-50";
const dropdownContainerClassesRightAligned =
  "absolute right-0 top-full pt-4 min-w-[12rem] transition-all duration-300 ease-out z-50";
const dropdownContainerClassesOpen =
  "opacity-100 visible translate-y-0 pointer-events-auto";
const dropdownContainerClassesClosed =
  "opacity-0 invisible translate-y-2 pointer-events-none";

const dropdownInnerClasses = cn(
  "flex flex-col gap-1 p-2 bg-black/80 backdrop-blur-xl",
  "rounded-[16px] shadow-[0px_4px_36px_0px_#FFFFFF40_inset]",
  "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]",
);

const dropdownItemClasses = cn(
  "block w-full text-left text-white font-bold transition-all p-3 rounded-lg",
  "hover:bg-[linear-gradient(0deg,#57CAFF_0%,#347999_100%)] hover:!text-transparent hover:bg-clip-text",
);

function useOutsideClick(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Check if the click target is NOT within the referenced element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Attach event listener to the document
    document.addEventListener("mousedown", handleClick);

    // Cleanup: Remove listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref;
}

const NavbarAvatarWidget = () => {
  const { decodedToken: user, status } = useAuthContext();

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useOutsideClick(() => setOpenDropdown(false));

  const optionsLoggedIn = [
    {
      label: "View Profile",
      href: "/sparkmates",
    },
    {
      label: "Sign Out",
      href: "/signout",
    },
  ];

  //  href="/sparkmates"
  return (
    <>
      {status === "checking" ? (
        <Box className="w-9 h-9 rounded-full bg-slate-700 animate-pulse"> </Box>
      ) : status === STATUS.AUTHENTICATED ? (
        <div
          className="relative flex justify-center items-center h-full group transition-all duration-200 cursor-pointer"
          ref={dropdownRef}
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          {user?.memberInfo.avatarUrl ? (
            <Avatar
              className="group-hover:scale-105 transition-all duration-200"
              src={user?.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT}
            />
          ) : (
            <div className="w-8 flex justify-center items-center text-black font-extrabold aspect-square rounded-full bg-gray-400 group-hover:scale-105 transition-all duration-200 cursor-pointer">
              {user?.memberInfo.firstName?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>
          )}
          {/* <Avatar
            className="group-hover:scale-105 transition-all duration-200"
            src={user?.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT}
          /> */}

          <div
            className={cn(
              dropdownContainerClassesRightAligned,
              openDropdown
                ? dropdownContainerClassesOpen
                : dropdownContainerClassesClosed,
            )}
          >
            <div className={dropdownInnerClasses}>
              {optionsLoggedIn.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  className={dropdownItemClasses}
                  onClick={() => setOpenDropdown(false)}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/signin"
          className="relative flex justify-center items-center group  hover:opacity-80 hover:scale-105 transition-all duration-200"
        >
          <Avatar
            className="group-hover:scale-105 transition-all duration-200"
            src={user?.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT}
          />
        </Link>
      )}
    </>
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
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(
    null,
  );

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = decodedToken;

  // Click outside handler to close mobile menu and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setIsMobileMenuOpen(false);
      }

      // Close dropdowns if clicked outside
      if (!(target as HTMLElement).closest(".desktop-dropdown-container")) {
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
    { href: "/products", label: "Products" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 md:px-16 md:pt-10 transition-all duration-700 ease-out",
      )}
    >
      <Box
        as="nav"
        className={cn(
          "mx-auto h-22 max-w-7xl md:rounded-[1.875rem]",
          "pointer-events-auto",
          "shadow-[0px_4px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040,0px_4px_36px_0px_#FFFFFF40_inset]",
          "bg-black/80 backdrop-blur-xl",
          "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]",
        )}
      >
        <Box className="h-full px-8 md:px-12 lg:px-20 flex items-center">
          <Inline
            justify="between"
            align="center"
            gap="lg"
            className="w-full h-full"
          >
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
            <Inline
              gap="lg"
              align="center"
              className="hidden min-[75rem]:flex h-full"
            >
              <Inline gap="md" align="center" className="h-full">
                {/* About Dropdown */}
                <div className="relative flex items-center h-full desktop-dropdown-container">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === "about" ? null : "about")
                    }
                    className={cn(
                      "flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full",
                      openDropdown === "about" ? "text-white" : "text-gray-300",
                    )}
                  >
                    <Text variant="body" weight="bold" className="text-inherit">
                      About
                    </Text>
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        openDropdown === "about" ? "rotate-180" : "",
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      dropdownContainerClassesBase,
                      openDropdown === "about"
                        ? dropdownContainerClassesOpen
                        : dropdownContainerClassesClosed,
                    )}
                  >
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
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "community" ? null : "community",
                      )
                    }
                    className={cn(
                      "flex items-center gap-1 hover:text-white transition-colors cursor-pointer h-full",
                      openDropdown === "community"
                        ? "text-white"
                        : "text-gray-300",
                    )}
                  >
                    <Text variant="body" weight="bold" className="text-inherit">
                      Community
                    </Text>
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        openDropdown === "community" ? "rotate-180" : "",
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      dropdownContainerClassesBase,
                      openDropdown === "community"
                        ? dropdownContainerClassesOpen
                        : dropdownContainerClassesClosed,
                    )}
                  >
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
                    <Text variant="body" weight="bold" className="text-inherit">
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </Inline>

              {/* Auth Section */}
              {!hideAuth && (
                <Inline gap="md" align="center" className="h-full">
                  <Link href="/id" className="flex items-center">
                    <Button variant="colored" subVariant="blue" size="md">
                      Get ID
                    </Button>
                  </Link>

                  <NavbarAvatarWidget />
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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </Box>
          </Inline>
        </Box>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-4 px-4 z-[60] animate-in fade-in slide-in-from-top-2 duration-200 min-[75rem]:hidden"
          >
            <Box
              className={cn(
                "py-3 w-full",
                "bg-black/95 backdrop-blur-2xl rounded-[16px] shadow-[0px_4px_36px_0px_#FFFFFF40_inset]",
                "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[2px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]",
              )}
            >
              <Stack gap="none">
                {/* About Section */}
                <button
                  onClick={() =>
                    setActiveMobileSection(
                      activeMobileSection === "about" ? null : "about",
                    )
                  }
                  className="w-full px-5 py-4 border-b border-white/10 flex items-center justify-between group/header"
                >
                  <Text
                    variant="body-sm"
                    weight="semibold"
                    className="text-gray-400 uppercase tracking-wider group-hover/header:text-gray-200 transition-colors"
                  >
                    About
                  </Text>
                  <svg
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform duration-200",
                      activeMobileSection === "about" ? "rotate-180" : "",
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeMobileSection === "about" && (
                  <div className="bg-white/5 py-2 animate-in slide-in-from-top-1 duration-200">
                    {dropdownLinks.about.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-8 py-3 text-base font-bold text-gray-200 transition-all hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Community Section */}
                <button
                  onClick={() =>
                    setActiveMobileSection(
                      activeMobileSection === "community" ? null : "community",
                    )
                  }
                  className="w-full px-5 py-4 border-b border-white/10 flex items-center justify-between group/header"
                >
                  <Text
                    variant="body-sm"
                    weight="semibold"
                    className="text-gray-400 uppercase tracking-wider group-hover/header:text-gray-200 transition-colors"
                  >
                    Community
                  </Text>
                  <svg
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform duration-200",
                      activeMobileSection === "community" ? "rotate-180" : "",
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeMobileSection === "community" && (
                  <div className="bg-white/5 py-2 animate-in slide-in-from-top-1 duration-200">
                    {dropdownLinks.community.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-8 py-3 text-base font-bold text-gray-200 transition-all hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Nav Links */}
                <button
                  onClick={() =>
                    setActiveMobileSection(
                      activeMobileSection === "navigation"
                        ? null
                        : "navigation",
                    )
                  }
                  className="w-full px-5 py-4 border-b border-white/10 flex items-center justify-between group/header"
                >
                  <Text
                    variant="body-sm"
                    weight="semibold"
                    className="text-gray-400 uppercase tracking-wider group-hover/header:text-gray-200 transition-colors"
                  >
                    Navigation
                  </Text>
                  <svg
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform duration-200",
                      activeMobileSection === "navigation" ? "rotate-180" : "",
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeMobileSection === "navigation" && (
                  <div className="bg-white/5 py-2 animate-in slide-in-from-top-1 duration-200">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-8 py-3 text-base font-bold text-gray-200 transition-all hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Auth Section */}
                {!hideAuth && (
                  <Box className="px-5 py-5">
                    <Stack gap="sm">
                      <Link
                        href="/sparkmates"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button
                          variant="colored"
                          subVariant="blue"
                          size="md"
                          className="w-full"
                        >
                          Get ID
                        </Button>
                      </Link>
                      {status === "checking" ? (
                        <Box className="w-full h-10 rounded-lg bg-slate-700 animate-pulse">
                          {" "}
                        </Box>
                      ) : status === STATUS.AUTHENTICATED ? (
                        <Link
                          href="/sparkmates"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Avatar
                            src={
                              decodedToken?.memberInfo.avatarUrl ||
                              ASSETS.AUTH.AVATAR_DEFAULT
                            }
                          />
                          <Stack gap="none">
                            <Text
                              variant="body-sm"
                              weight="semibold"
                              className="text-white"
                            >
                              {decodedToken?.memberInfo.firstName || "User"}
                            </Text>
                            <Text variant="body-sm" className="text-gray-400">
                              View Profile
                            </Text>
                          </Stack>
                        </Link>
                      ) : (
                        <Link
                          href="/signin"
                          className="block w-full text-center py-3 px-4 rounded-lg border border-gray-500 text-base font-bold text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
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
          </div>
        )}
      </Box>
    </motion.div>
  );
};
