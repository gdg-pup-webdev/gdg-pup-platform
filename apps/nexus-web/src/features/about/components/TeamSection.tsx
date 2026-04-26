// To be improved pa initial designs only

"use client";

import React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
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
  TeamCard,
} from "@packages/spark-ui";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { TEAM_MEMBERS_BY_SLUG } from "@/features/products/components/team-structure-section/team-members.data";

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
  { id: "administrative", label: "Administrative" },
  { id: "marketing", label: "Marketing" },
  { id: "creatives", label: "Creatives" },
  { id: "operations", label: "Operations" },
  { id: "community-relations", label: "Community Relations" },
  { id: "partnership", label: "Partnership" },
];

const TECH_ITEMS = [
  { id: "tech-executives", label: "Tech Executives" },
  { id: "project-management", label: "Project Management" },
  { id: "web-development", label: "Web Development" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "cloud-solutions", label: "Cloud Solutions" },
  { id: "data-ml", label: "Data and ML" },
  { id: "internet-of-things", label: "Internet of Things" },
];

const ALL_ITEMS = [...TOP_LEVEL_ITEMS, ...TECH_ITEMS];
const STATIC_RAINBOW_GRADIENT =
  "linear-gradient(135deg, rgba(52,168,83,1) 0%, rgba(66,133,244,1) 33%, rgba(234,67,53,1) 66%, rgba(249,171,0,1) 100%)";

export function TeamSection() {
  const [activeId, setActiveId] = React.useState<string>(ALL_ITEMS[0].id);
  const mobileNavRef = React.useRef<HTMLDivElement>(null);
  const [showFloatingTeamNav, setShowFloatingTeamNav] = React.useState(false);
  const [isCoreTeamsOpen, setIsCoreTeamsOpen] = React.useState(true);
  const [isTechDepartmentOpen, setIsTechDepartmentOpen] = React.useState(true);
  const activeLabel = React.useMemo(
    () => ALL_ITEMS.find((item) => item.id === activeId)?.label ?? "Administrative",
    [activeId],
  );

  // Track which section is in view to highlight the correct sidebar item
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ALL_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        {
          // Fire when section crosses the upper 30% of the viewport
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  React.useEffect(() => {
    const mobileNav = mobileNavRef.current;
    if (!mobileNav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isDesktop = window.innerWidth >= 1024;
        setShowFloatingTeamNav(!isDesktop && !entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(mobileNav);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFloatingTeamNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Smooth scroll helper
  const scrollToSection = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Add a small delay to ensure smooth scrolling works properly
      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, []);

  const renderDropdownTeamItems = React.useCallback(
    (items: Array<{ id: string; label: string }>) =>
      items.map(({ id, label }) => (
        <DropdownItem
          key={id}
          onClick={() => scrollToSection(id)}
          className={activeId === id ? "bg-white/[0.04]" : undefined}
        >
          <Text
            as="span"
            variant="body-sm"
            weight={activeId === id ? "semibold" : "normal"}
            className={activeId === id ? "text-[#F9AB00]" : "text-white"}
          >
            {label}
          </Text>
        </DropdownItem>
      )),
    [activeId, scrollToSection],
  );

  function renderTeamDropdownItems() {
    return (
      <>
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2"
          onClick={() => setIsCoreTeamsOpen((prev) => !prev)}
          aria-expanded={isCoreTeamsOpen}
        >
          <Text as="span" variant="body" weight="semibold" gradient="yellow" className="uppercase tracking-wide">
            Core Teams
          </Text>
          <svg
            viewBox="0 0 20 20"
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isCoreTeamsOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            aria-hidden
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {isCoreTeamsOpen && (
            <motion.div
              key="core-teams"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              {renderDropdownTeamItems(TOP_LEVEL_ITEMS)}
            </motion.div>
          )}
        </AnimatePresence>

        <DropdownSeparator />

        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2"
          onClick={() => setIsTechDepartmentOpen((prev) => !prev)}
          aria-expanded={isTechDepartmentOpen}
        >
          <Text as="span" variant="body" weight="semibold" gradient="yellow" className="uppercase tracking-wide">
            Tech Department
          </Text>
          <svg
            viewBox="0 0 20 20"
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTechDepartmentOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            aria-hidden
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {isTechDepartmentOpen && (
            <motion.div
              key="tech-department"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              {renderDropdownTeamItems(TECH_ITEMS)}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Section content map
  const SECTION_CONTENT = React.useMemo(() => ({
    administrative: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.administrative.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    marketing: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.marketing.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    creatives: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.creatives.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    operations: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.operations.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "community-relations": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["community-relations"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    partnership: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.partnership.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "tech-executives": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["tech-executives"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "project-management": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["project-management"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "web-development": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["web-development"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "ui-ux": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["ui-ux"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    cybersecurity: (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG.cybersecurity.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "cloud-solutions": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["cloud-solutions"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "data-ml": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {TEAM_MEMBERS_BY_SLUG["data-ml"].map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
    "internet-of-things": (
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {(TEAM_MEMBERS_BY_SLUG["internet-of-things"] ?? TEAM_MEMBERS_BY_SLUG.iot ?? []).map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    ),
  }), []);

  return (
    <div
      className="relative overflow-x-clip pt-32 md:pt-48 pb-16 md:pb-28 px-4 md:px-8 lg:px-16 bg-[#010B1D]"
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
        className="fixed rounded-full pointer-events-none hidden md:block"
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
        className="fixed rounded-full pointer-events-none hidden md:block"
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
                width={138}
                height={78}
                alt="GDG Logo"
                className="pointer-events-none select-none block h-auto w-[min(44vw,8.5rem)] md:w-[9.75rem]"
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
            <div className="w-full lg:w-auto lg:pb-4 lg:sticky lg:top-35 lg:self-start">
              {/* Mobile: dropdown navigator */}
              <div ref={mobileNavRef} className="lg:hidden mb-1 w-full [&>*]:block [&>*]:w-full">
                <Dropdown>
                  <DropdownTrigger asChild>
                    <button
                      type="button"
                      className="group w-[calc(100vw-2rem)] max-w-full rounded-[10px] p-px shadow-[inset_0px_2px_12px_0px_rgba(255,255,255,0.05)]"
                      style={{ background: STATIC_RAINBOW_GRADIENT }}
                      aria-label="Choose team department"
                    >
                      <div className="w-full h-12 px-4 flex items-center justify-between rounded-[9px] bg-[rgba(15,14,14,0.96)] backdrop-blur-md text-white">
                        <span className="text-[1.12rem] font-semibold bg-clip-text text-transparent bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(249,171,0,0.96)_100%)]">
                          {activeLabel}
                        </span>
                        <span className="text-white leading-none flex items-center justify-center w-5 h-5">
                          <svg viewBox="0 0 20 20" className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" fill="none" aria-hidden>
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent
                    size="full"
                    position="bottom-start"
                    className="w-[calc(100vw-2rem)] max-w-full min-w-0 rounded-[12px] border-0 p-px shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
                    style={{ background: STATIC_RAINBOW_GRADIENT }}
                  >
                    <div className="max-h-[56vh] overflow-y-auto overscroll-contain touch-pan-y rounded-[11px] bg-[rgba(15,14,14,0.97)] backdrop-blur-md">
                      {renderTeamDropdownItems()}
                    </div>
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* Mobile: floating quick-nav when main dropdown leaves viewport */}
              <AnimatePresence>
                {showFloatingTeamNav && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.92 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed bottom-5 right-4 z-40 lg:hidden"
                  >
                    <Dropdown>
                      <DropdownTrigger asChild>
                        <button
                          type="button"
                          aria-label="Open team quick navigation"
                          className="group size-14 rounded-full p-px text-white shadow-[0_10px_28px_rgba(0,0,0,0.4)] flex items-center justify-center"
                          style={{ background: STATIC_RAINBOW_GRADIENT }}
                        >
                          <span className="flex size-full items-center justify-center rounded-full bg-[rgba(15,14,14,0.94)] backdrop-blur-md">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-6 h-6 transition-transform duration-200 ease-out group-aria-expanded:rotate-90"
                              fill="none"
                              aria-hidden
                            >
                              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </span>
                        </button>
                      </DropdownTrigger>
                      <DropdownContent
                        size="md"
                        position="top-end"
                        className="w-[min(19rem,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto overscroll-contain touch-pan-y rounded-[12px] border border-transparent bg-[rgba(15,14,14,0.97)] backdrop-blur-md shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
                        style={{
                          background: `linear-gradient(rgba(15,14,14,0.97), rgba(15,14,14,0.97)) padding-box, ${STATIC_RAINBOW_GRADIENT} border-box`,
                        }}
                      >
                        {renderTeamDropdownItems()}
                      </DropdownContent>
                    </Dropdown>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop sidebar */}
              <div className="hidden lg:block w-64 pb-4">
                <Sidebar>
                  {TOP_LEVEL_ITEMS.map(({ id, label }) => (
                    <SidebarItem
                      key={id}
                      active={activeId === id}
                      onClick={() => scrollToSection(id)}
                    >
                      {label}
                    </SidebarItem>
                  ))}
                  <SidebarGroup label="Tech Department" defaultOpen>
                    {TECH_ITEMS.map(({ id, label }) => (
                      <SidebarItem
                        key={id}
                        nested
                        active={activeId === id}
                        onClick={() => scrollToSection(id)}
                      >
                        {label}
                      </SidebarItem>
                    ))}
                  </SidebarGroup>
                </Sidebar>
              </div>
            </div>

            {/* All sections stacked — scroll target via id */}
            <div className="flex-1 min-w-0 overflow-x-clip w-full">
              {ALL_ITEMS.map(({ id, label }) => (
                <section
                  key={id}
                  id={id}
                  // scroll-mt offsets the sticky header height so the section
                  // title isn't hidden behind the navbar after scrollIntoView
                  className="scroll-mt-24 mb-20 last:mb-0"
                >
                  <FadeInSection>
                    <Text
                      as="h3"
                      variant="heading-4"
                      weight="bold"
                      gradient="white-yellow"
                      align="center"
                      className="mb-6 border-b border-white/10 pb-3"
                    >
                      {label}
                    </Text>
                    {SECTION_CONTENT[id as keyof typeof SECTION_CONTENT]}
                  </FadeInSection>
                </section>
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}


