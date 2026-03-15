// To be improved pa initial designs only

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Container,
  Stack,
  Text,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Sidebar,
  SidebarItem,
  SidebarGroup,
} from "@packages/spark-ui";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

const FadeInSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Zoned blob background (team page only) ─────────────────────────────────
// 3 blobs: blue at top · yellow + red at centre

type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

// ── Edit these values to tune the blobs ──────────────────────────────────────
const TEAM_BLOBS = {
  blue: {
    width: 2400,
    height: 700,
    top: -470,
    left: "calc(50% - 1200px)" as const,
    color:
      "radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.64) 0%, rgba(255, 255, 255, 0.36) 16%, rgba(66, 133, 244, 0.18) 40%, rgba(66, 133, 244, 0.06) 56%, rgba(66, 133, 244, 0) 78%)",
    blur: 210,
    motion: "vertical" as BlobMotion,
    duration: 92, // seconds per cycle
    travel: 16, // px max drift
    delay: "0s",
    interactive: false,
    interactiveStrength: 0,
    // fixed: false — stays absolute, scrolls with section
    fixed: false as const,
    fixedTop: undefined as string | undefined,
    fixedLeft: undefined as string | undefined,
  },
  red: {
    width: 620,
    height: 620,
    top: 560,
    left: "calc(20% - 200px)" as const,
    color: "transparent",
    blur: 120,
    motion: "diagonal" as BlobMotion,
    duration: 75,
    travel: 30,
    delay: "-20s",
    interactive: false,
    interactiveStrength: 0.04,
    // fixed: true — follows viewport while scrolling (like the sidebar)
    // Use vh/vw units for viewport-relative placement
    fixed: true as const,
    fixedTop: "28vh",
    fixedLeft: "-20vw",
  },
  yellow: {
    width: 640,
    height: 640,
    top: 540,
    left: "calc(55%)" as const,
    color: "transparent",
    blur: 130,
    motion: "horizontal" as BlobMotion,
    duration: 85,
    travel: 32,
    delay: "-10s",
    interactive: false,
    interactiveStrength: 0.04,
    // fixed: true — follows viewport
    fixed: true as const,
    fixedTop: "36vh",
    fixedLeft: "72vw",
  },
} satisfies Record<
  string,
  {
    width: number;
    height: number;
    top: number;
    left?: string;
    right?: string;
    color: string;
    blur: number;
    motion: BlobMotion;
    duration: number;
    travel: number;
    delay: string;
    interactive: boolean;
    interactiveStrength: number;
    fixed: boolean;
    fixedTop: string | undefined;
    fixedLeft: string | undefined;
  }
>;
// ─────────────────────────────────────────────────────────────────────────────

function motionToTeamAnimation(
  m: BlobMotion,
  duration: number,
  delay: string,
): React.CSSProperties {
  if (m === "none") return {};
  const kf =
    m === "vertical"
      ? "blobDriftV"
      : m === "horizontal"
        ? "blobDriftH"
        : "blobDriftD";
  // Use individual animation properties instead of the shorthand to avoid
  // React's "conflicting shorthand + longhand" rerender warning.
  return {
    animationName: kf,
    animationDuration: `${duration}s`,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDelay: delay,
  };
}

function TeamBlobBackground() {
  const blueRef = useRef<HTMLDivElement>(null);

  function blobStyle(
    cfg: (typeof TEAM_BLOBS)[keyof typeof TEAM_BLOBS],
  ): React.CSSProperties {
    const base: React.CSSProperties = {
      position: cfg.fixed ? "fixed" : "absolute",
      // Keep blobs above the solid page background, but below content.
      zIndex: 0,
      borderRadius: "50%",
      pointerEvents: "none",
      willChange: "transform",
      width: cfg.width,
      height: cfg.height,
      background: cfg.color,
      filter: `blur(${cfg.blur}px)`,
      ["--travel" as string]: `${cfg.travel}px`,
      ...motionToTeamAnimation(cfg.motion, cfg.duration, cfg.delay),
    };
    if (cfg.fixed && cfg.fixedTop !== undefined) {
      // Viewport-relative positioning for fixed blobs
      base.top = cfg.fixedTop;
      base.left = cfg.fixedLeft;
    } else {
      // Absolute positioning within the section
      base.top = cfg.top;
      base.left = cfg.left;
    }
    return base;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Blue — stays absolute, anchored to top of section */}
      <motion.div
        ref={blueRef}
        style={blobStyle(TEAM_BLOBS.blue)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      />
    </div>
  );
}

const TOP_LEVEL_ITEMS = [
  { href: "/about/team/administrative", label: "Administrative" },
  { href: "/about/team/marketing", label: "Marketing" },
  { href: "/about/team/creatives", label: "Creatives" },
  { href: "/about/team/operations", label: "Operations" },
  { href: "/about/team/community-relations", label: "Community Relations" },
  { href: "/about/team/partnership", label: "Partnership" },
];

const TECH_ITEMS = [
  { href: "/about/team/tech-executives", label: "Tech Executives" },
  { href: "/about/team/project-management", label: "Project Management" },
  { href: "/about/team/web-development", label: "Web Development" },
  { href: "/about/team/ui-ux", label: "UI/UX" },
  { href: "/about/team/cybersecurity", label: "Cybersecurity" },
  { href: "/about/team/cloud-solutions", label: "Cloud Solutions" },
  { href: "/about/team/data-ml", label: "Data and ML" },
  { href: "/about/team/internet-of-things", label: "Internet of Things" },
];
const ALL_TEAM_ITEMS = [...TOP_LEVEL_ITEMS, ...TECH_ITEMS];

export function TeamSection({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTeamLabel =
    ALL_TEAM_ITEMS.find((item) => item.href === pathname)?.label ?? "Administrative";

  return (
    <div
      className="relative overflow-x-clip pt-36 md:pt-60 pb-20 md:pb-48 px-4 md:px-8 lg:px-16"
      style={{ backgroundColor: "rgba(15, 14, 14, 1)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[620px] pointer-events-none hidden md:block"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% -34%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.34) 16%, rgba(66,133,244,0.15) 40%, rgba(66,133,244,0.06) 56%, rgba(66,133,244,0) 80%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(560px, 42vw)",
          height: "min(560px, 42vw)",
          left: "-180px",
          top: "65%",
          zIndex: 0,
          background: "rgba(234, 67, 53, 0.24)",
          filter: "blur(180px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(500px, 38vw)",
          height: "min(500px, 38vw)",
          right: "-160px",
          top: "36%",
          zIndex: 0,
          background: "rgba(249, 171, 0, 0.22)",
          filter: "blur(170px)",
        }}
      />
      {/* Zoned blob background — team page only */}
      <div className="hidden md:block">
        <TeamBlobBackground />
      </div>

      {/* Decorative Image - Upper ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none hidden md:block md:[top:8.6rem] md:[width:94vw] md:[height:24vh]"
        style={{ top: "9rem", width: "78vw", height: "30vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.ELLIPSE_UPPER}
          alt=""
          fill
          className="object-contain md:scale-x-[1.34] md:scale-y-[0.72] md:origin-top"
        />
      </motion.div>

      {/* Decorative Image - Lower ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none hidden md:block md:[top:22.7rem] md:[width:66vw] md:[height:16vh]"
        style={{ top: "23rem", width: "56vw", height: "21vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.ELLIPSE_LOWER}
          alt=""
          fill
          className="object-contain md:scale-x-[1.28] md:scale-y-[0.76] md:origin-top"
        />
      </motion.div>

      {/* Decorative star — right side of hero */}
      <motion.div
        initial={{ opacity: 0, y: 14, x: 14 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ top: "9.5rem", right: "-4.2rem", width: "176px", height: "256px", zIndex: 1 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.STAR}
          alt=""
          fill
          className="object-contain opacity-85"
        />
      </motion.div>

      {/* Decorative star — left side, below sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 14, x: -14 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ top: "73rem", left: "-3.8rem", width: "160px", height: "232px", zIndex: 1 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.STAR}
          alt=""
          fill
          className="object-contain opacity-80"
        />
      </motion.div>

      <Container
        maxWidth="7xl"
        padding="lg"
        className="relative z-10 flex flex-col flex-1 min-h-0"
      >
        <Stack gap="2xl" className="flex flex-col flex-1 min-h-0">
          {/* Hero Header */}
          <FadeInSection className="mb-4 md:mb-8">
            <Stack gap="md" align="center">
              <Image
                src={ASSETS.TEAM.HERO_ICON}
                width={128}
                height={128}
                alt="GDG Logo"
                className="hidden md:block"
              />
              <Text
                as="h1"
                variant="heading-1"
                weight="bold"
                gradient="white-blue"
                align="center"
                className="max-md:text-[40px] max-md:leading-[1.1]"
              >
                Built by Spark.
              </Text>
              <Text
                as="h2"
                variant="heading-2"
                weight="bold"
                gradient="white-green"
                align="center"
                className="max-md:text-[40px] max-md:leading-[1.1]"
              >
                Meet the team behind GDG PUP.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0 pb-8">
            <div className="w-full lg:w-auto lg:pb-4">
              {/* Mobile: dropdown navigator */}
              <div className="lg:hidden mb-1 w-full [&>*]:block [&>*]:w-full">
                <Dropdown>
                  <DropdownTrigger asChild>
                    <button
                      type="button"
                      className="w-[calc(100vw-2rem)] max-w-full rounded-[3px] p-px bg-[linear-gradient(90deg,rgba(52,168,83,1)_0%,rgba(66,133,244,1)_35%,rgba(234,67,53,1)_68%,rgba(249,171,0,1)_100%)]"
                      aria-label="Choose team department"
                    >
                      <div className="w-full h-12 px-4 flex items-center justify-between bg-[rgba(15,14,14,0.96)] text-white">
                        <span className="text-[1.12rem] font-semibold bg-clip-text text-transparent bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(249,171,0,0.96)_100%)]">
                          {currentTeamLabel}
                        </span>
                        <span className="text-white leading-none flex items-center justify-center w-5 h-5">
                          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent size="full" position="bottom-start" className="w-[calc(100vw-2rem)] max-w-full min-w-0 max-h-[56vh] overflow-y-auto overscroll-contain touch-pan-y">
                    <DropdownLabel>Core Teams</DropdownLabel>
                    {TOP_LEVEL_ITEMS.map(({ href, label }) => (
                      <DropdownItem
                        key={href}
                        onClick={() => router.push(href)}
                        className={pathname === href ? "text-[rgba(249,171,0,1)]" : undefined}
                      >
                        {label}
                      </DropdownItem>
                    ))}
                    <DropdownSeparator />
                    <DropdownLabel>Tech Department</DropdownLabel>
                    {TECH_ITEMS.map(({ href, label }) => (
                      <DropdownItem
                        key={href}
                        onClick={() => router.push(href)}
                        className={pathname === href ? "text-[rgba(249,171,0,1)]" : undefined}
                      >
                        {label}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* Desktop sidebar */}
              <div className="hidden lg:block">
                <Sidebar>
                  {TOP_LEVEL_ITEMS.map(({ href, label }) => (
                    <SidebarItem
                      key={href}
                      href={href}
                      active={pathname === href}
                      linkComponent={Link}
                    >
                      {label}
                    </SidebarItem>
                  ))}
                  <SidebarGroup label="Tech Department" defaultOpen>
                    {TECH_ITEMS.map(({ href, label }) => (
                      <SidebarItem
                        key={href}
                        nested
                        href={href}
                        active={pathname === href}
                        linkComponent={Link}
                      >
                        {label}
                      </SidebarItem>
                    ))}
                  </SidebarGroup>
                </Sidebar>
              </div>
            </div>

            {/* Main content */}
            {/* overflow-x-clip prevents horizontal scrollbar from tilt transforms
                without creating a scroll container (unlike overflow-x-hidden) */}
            <div className="flex-1 min-w-0 overflow-x-clip w-full max-md:flex max-md:flex-col max-md:items-center">{children}</div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}


