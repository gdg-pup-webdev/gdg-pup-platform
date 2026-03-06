// To be improved pa initial designs only

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import {
  Container,
  Stack,
  Text,
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
    width: 680,
    height: 680,
    top: -430,
    left: "calc(50% - 340px)" as const,
    color: "#4286f4a8", // B3 = 70% opacity
    blur: 210, // px — lower=more visible, higher=softer
    motion: "vertical" as BlobMotion,
    duration: 92, // seconds per cycle
    travel: 36, // px max drift
    delay: "0s",
    interactive: true, // true = follows mouse
    interactiveStrength: 0.25, // 0–1
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
    color: "#ea44354f",
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
    color: "#f9aa0021",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);

  // Tracks whether the team section is in the viewport.
  // Fixed blobs are hidden when the section scrolls out so they don't
  // bleed over other pages.
  const [sectionVisible, setSectionVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const blobRefs: Record<
    keyof typeof TEAM_BLOBS,
    React.RefObject<HTMLDivElement | null>
  > = {
    blue: blueRef,
    yellow: yellowRef,
    red: redRef,
  };

  useEffect(() => {
    const hasInteractive = Object.values(TEAM_BLOBS).some((b) => b.interactive);
    if (!hasInteractive) return;
    const targets = (Object.keys(TEAM_BLOBS) as (keyof typeof TEAM_BLOBS)[])
      .filter((k) => TEAM_BLOBS[k].interactive)
      .map((k) => ({
        ref: blobRefs[k],
        strength: TEAM_BLOBS[k].interactiveStrength,
        cx: 0,
        cy: 0,
      }));
    let mouseX = 0,
      mouseY = 0,
      rafId: number;
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };
    const tick = () => {
      for (const t of targets) {
        t.cx += (mouseX * t.strength - t.cx) * 0.08;
        t.cy += (mouseY * t.strength - t.cy) * 0.08;
        if (t.ref.current)
          t.ref.current.style.translate = `${t.cx.toFixed(1)}px ${t.cy.toFixed(1)}px`;
      }
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  function blobStyle(
    cfg: (typeof TEAM_BLOBS)[keyof typeof TEAM_BLOBS],
  ): React.CSSProperties {
    const base: React.CSSProperties = {
      position: cfg.fixed ? "fixed" : "absolute",
      // Negative z-index keeps blobs behind all page content (nav, footer, cards).
      // -1 is enough since most elements sit at z-index: auto (0).
      zIndex: -1,
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
    // overflow-hidden NOT used here — fixed blobs escape their parent by design
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {/* Blue — stays absolute, anchored to top of section */}
      <motion.div
        ref={blueRef}
        style={blobStyle(TEAM_BLOBS.blue)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      />
      {/* Yellow — fixed to viewport, fades out when section leaves view */}
      <motion.div
        ref={yellowRef}
        style={blobStyle(TEAM_BLOBS.yellow)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: sectionVisible ? 1 : 0,
          scale: sectionVisible ? 1 : 0.4,
        }}
        transition={{
          duration: sectionVisible ? 2.2 : 0.6,
          ease: "easeOut",
          delay: sectionVisible ? 0.35 : 0,
        }}
      />
      {/* Red — fixed to viewport, fades out when section leaves view */}
      <motion.div
        ref={redRef}
        style={blobStyle(TEAM_BLOBS.red)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: sectionVisible ? 1 : 0,
          scale: sectionVisible ? 1 : 0.4,
        }}
        transition={{
          duration: sectionVisible ? 2.2 : 0.6,
          ease: "easeOut",
          delay: sectionVisible ? 0.7 : 0,
        }}
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

export function TeamSection({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative overflow-x-clip pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Zoned blob background — team page only */}
      <TeamBlobBackground />

      {/* Decorative Image - Upper ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ top: "10rem", width: "47vw", height: "30vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.ELLIPSE_UPPER}
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Decorative Image - Lower ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ top: "24rem", width: "32vw", height: "20vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src={ASSETS.TEAM.ELLIPSE_LOWER}
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      <Container
        maxWidth="7xl"
        padding="lg"
        className="relative flex flex-col flex-1 min-h-0"
      >
        <Stack gap="2xl" className="flex flex-col flex-1 min-h-0">
          {/* Hero Header */}
          <FadeInSection className="mb-8">
            <Stack gap="md" align="center">
              <Image
                src={ASSETS.TEAM.HERO_ICON}
                width={128}
                height={128}
                alt="GDG Logo"
              />
              <Text
                as="h1"
                variant="heading-1"
                weight="bold"
                gradient="white-blue"
                align="center"
              >
                Built by Spark.
              </Text>
              <Text
                as="h2"
                variant="heading-2"
                weight="bold"
                gradient="white-green"
                align="center"
              >
                Meet the team behind GDG PUP.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0 pb-8">
            {/* Sidebar — sticky to viewport; max-h + overflow-y-auto lets it
                scroll internally when it's taller than the visible area */}
            <div className="w-full lg:w-auto lg:sticky lg:top-40 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pb-4">
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

            {/* Main content */}
            {/* overflow-x-clip prevents horizontal scrollbar from tilt transforms
                without creating a scroll container (unlike overflow-x-hidden) */}
            <div className="flex-1 min-w-0 overflow-x-clip">{children}</div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
