/* For improvements:
 * Add real links to the Read More buttons when article pages are built
 * Update "Join Our Journey" href when a dedicated join page is created
 */
"use client";

import {
  Box,
  Stack,
  Grid,
  Container,
  Text,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
} from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/constants/assets";

// ─── Zoned blob background (history page only) ───────────────────────────────
// Each blob is pinned to its own vertical region and drifts independently.
// Regions (top → bottom): green · yellow · blue · red

/** Motion patterns available for each blob */
type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

// ─────────────────────────────────────────────────────────────────────────────
const BLOBS = {
  green: {
    width: 620, height: 600,
    top: 550, left: "calc(15% - 60px)" as const,
    color: "#4DB368CC", blur: 310,
    motion: "diagonal" as BlobMotion,
    duration: 80, travel: 38, delay: "-30s",
    interactive: true, interactiveStrength: 0.18,
  },
  yellow: {
    width: 640, height: 640,
    top: 760, left: "calc(38% - 80px)" as const,
    color: "#F9AB00B3", blur: 210,
    motion: "horizontal" as BlobMotion,
    duration: 58, travel: 34, delay: "-14s",
    interactive: false, interactiveStrength: 0.04,
  },
  blue: {
    width: 620, height: 600,
    top: 1200, left: "calc(85% - 350px)" as const,
    color: "#4285F4B3", blur: 310,
    motion: "vertical" as BlobMotion,
    duration: 88, travel: 38, delay: "-20s",
    interactive: true, interactiveStrength: 0.18,
  },
  red: {
    width: 500, height: 500,
    top: 2000, left: "calc(5% - 60px)" as const,
    color: "#EA4335BF", blur: 250,
    motion: "horizontal" as BlobMotion,
    duration: 96, travel: 38, delay: "-30s",
    interactive: false, interactiveStrength: 0.04,
  },
} satisfies Record<string, {
  width: number; height: number;
  top: number; left?: string; right?: string;
  color: string; blur: number;
  motion: BlobMotion; duration: number; travel: number; delay: string;
  interactive: boolean; interactiveStrength: number;
}>;
// ─────────────────────────────────────────────────────────────────────────────

/** Maps a motion type to the CSS keyframe animation string */
function motionToAnimation(motion: BlobMotion, duration: number, delay: string): React.CSSProperties {
  if (motion === "none") return {};
  const keyframe =
    motion === "vertical" ? "blobDriftV" :
      motion === "horizontal" ? "blobDriftH" :
        "blobDriftD";
  return {
    animation: `${keyframe} ${duration}s ease-in-out infinite`,
    animationDelay: delay,
  };
}

function HistoryBlobBackground() {
  // Container ref used to calculate mouse offset for interactive blobs
  const containerRef = useRef<HTMLDivElement>(null);
  // One ref per potentially-interactive blob (same order as BLOBS keys)
  const greenRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);

  const blobRefs: Record<keyof typeof BLOBS, React.RefObject<HTMLDivElement | null>> = {
    green: greenRef, yellow: yellowRef, blue: blueRef, red: redRef,
  };

  // Mouse-follow: smoothly lerp interactive blobs toward the cursor
  useEffect(() => {
    const hasInteractive = Object.values(BLOBS).some((b) => b.interactive);
    if (!hasInteractive) return;

    const targets: { ref: React.RefObject<HTMLDivElement | null>; strength: number; cx: number; cy: number }[] =
      (Object.keys(BLOBS) as (keyof typeof BLOBS)[])
        .filter((k) => BLOBS[k].interactive)
        .map((k) => ({ ref: blobRefs[k], strength: BLOBS[k].interactiveStrength, cx: 0, cy: 0 }));

    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

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
        if (t.ref.current) {
          t.ref.current.style.translate = `${t.cx.toFixed(1)}px ${t.cy.toFixed(1)}px`;
        }
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

  const base: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
    willChange: "transform",
  };

  // Builds the full style for a blob including the --travel CSS var
  function blobStyle(
    cfg: (typeof BLOBS)[keyof typeof BLOBS],
    pos: { top?: number; left?: string; right?: string }
  ): React.CSSProperties {
    return {
      ...base,
      ...pos,
      width: cfg.width,
      height: cfg.height,
      background: cfg.color,
      filter: `blur(${cfg.blur}px)`,
      // --travel is read by the keyframes in globals.css
      ["--travel" as string]: `${cfg.travel}px`,
      ...motionToAnimation(cfg.motion, cfg.duration, cfg.delay),
    };
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* ── Green — top, horizontally centred ── */}
      <motion.div
        ref={greenRef}
        style={blobStyle(BLOBS.green, { top: BLOBS.green.top, left: BLOBS.green.left })}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      />

      {/* ── Yellow — below green, left-centre ── */}
      <motion.div
        ref={yellowRef}
        style={blobStyle(BLOBS.yellow, { top: BLOBS.yellow.top, left: BLOBS.yellow.left })}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }}
      />

      {/* ── Blue — below yellow, further right ── */}
      <motion.div
        ref={blueRef}
        style={blobStyle(BLOBS.blue, { top: BLOBS.blue.top, left: BLOBS.blue.left })}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
      />

      {/* ── Red — below blue, left side ── */}
      <motion.div
        ref={redRef}
        style={blobStyle(BLOBS.red, { top: BLOBS.red.top, left: BLOBS.red.left })}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 1.05 }}
      />
    </div>
  );
}

// Animation wrapper for major sections
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

// Per-card scroll reveal — each card triggers independently
const AnimatedCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  // once: false → card fades out when it leaves the viewport too
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const milestones = [
  {
    slug: "the-spark",
    title: "The Spark",
    excerpt: "Tech students at PUP had a problem. The university taught theory. Textbooks covered concepts but gave no space to build.",
    buttonColor: "green" as const,
    image: "/about/history/the-spark.jpg",
    href: "/articles/a5e895ea-1223-4958-af05-1319cc98ec0a"
  },
  {
    slug: "year-one",
    title: "Year One: Everything at Once",
    excerpt: "Six tech teams formed in those first months. Data Science, Web Dev, Mobile, Cloud, Design, and Competitive Programming — all in Year One.",
    buttonColor: "yellow" as const,
    image: "/about/history/year-one-everything.webp",
    href: "/articles/3e672b68-5890-4990-86a8-4622e019e7d3"
  },
  {
    slug: "year-two",
    title: "Year Two: The Test",
    excerpt: "Departmental exams returned to CCIS and attendance dropped across campus orgs. GDG PUP held ground by doubling down on quality.",
    buttonColor: "red" as const,
    image: "/about/history/year-two-test.jpg",
    href: "/articles/55cf5ee1-1ab1-4a9d-b9d0-497d644baa53"
  },
  {
    slug: "year-three",
    title: "Year Three: The Turnaround",
    excerpt: "Xian Cheng took over as Lead. Francis Chuaunsu continued as CEO. The org leaned into community-building and external partnerships.",
    buttonColor: "blue" as const,
    image: "/about/history/year-three-turnaround.jpg",
    href: "/articles/aa4ec512-a068-4866-ba5d-8bf9bb90325c"
  },
  {
    slug: "the-impact",
    title: "The Impact",
    excerpt: "Numbers tell part of the story. Over 2,000 members trained across three years, study jams every month, and a growing network of partners.",
    buttonColor: "green" as const,
    image: "/about/history/the-impact.png",
    href: "/articles/e5c96ec3-71c2-4e36-b065-0105aee46a08"
  },
  {
    slug: "living-community",
    title: "The Living Community",
    excerpt: "Year four arrived with new leaders ready to step up. Randy Lorenzo took the helm and the chapter kept growing — for the students, by the students.",
    buttonColor: "yellow" as const,
    image: "/about/history/the-living-community.webp",
    href: "/articles/1713f93d-558b-4eab-9530-29d0770080f9"
  },
  {
    slug: "your-chapter",
    title: "Your Chapter Hasn't Been Written Yet",
    excerpt: "Three years and counting proved something important: this community is built by the people who show up. That includes you.",
    buttonColor: "red" as const,
    image: "/about/history/your-chapter.webp",
    href: "/articles/f946e2dd-e0e2-41f2-9329-360b5dc44c2c"
  },
];

const buttonColorMap: Record<string, string> = {
  green: "bg-gradient-to-b from-[#016630] to-[#00C950] hover:brightness-110 text-white",
  yellow: "bg-gradient-to-b from-[#8E7200] to-[#F0B100] hover:brightness-110 text-black",
  red: "bg-gradient-to-b from-[#82181A] to-[#EA4335] hover:brightness-110 text-white",
  blue: "bg-gradient-to-b from-[#162456] to-[#2B7FFF] hover:brightness-110 text-white",
};

const borderGradientMap: Record<string, string> = {
  green:  "bg-gradient-to-r from-[#016630] via-[#00C950] to-[#016630]",
  yellow: "bg-gradient-to-r from-[#8E7200] via-[#F0B100] to-[#8E7200]",
  red:    "bg-gradient-to-r from-[#82181A] via-[#EA4335] to-[#82181A]",
  blue:   "bg-gradient-to-r from-[#162456] via-[#2B7FFF] to-[#162456]",
};

// Single milestone card — thumbnail + title + excerpt + Read More button
const MilestoneCard = ({
  milestone,
}: {
  milestone: (typeof milestones)[number];
}) => (
  <div className="relative w-full">
    <div
      className={`absolute inset-0 rounded-3xl p-[1px] pointer-events-none z-10 ${borderGradientMap[milestone.buttonColor]}`}
      style={{
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
    <Card className="border-0 flex flex-col justify-between w-full">
      {milestone.image && (
        <div className="relative w-full aspect-video rounded-[20px] overflow-hidden mb-2">
          <Image
            src={milestone.image}
            alt={milestone.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-4xl md:text-2xl lg:text-4xl font-bold text-center">{milestone.title}</CardTitle>      </CardHeader>
      <CardContent className="flex-1">
      <Text variant="body" className="text-gray-300 line-clamp-3 text-center text-sm md:text-base lg:text-xl">          {milestone.excerpt}
          {milestone.excerpt}
        </Text>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href={milestone.href}>
          <button
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 ${buttonColorMap[milestone.buttonColor]}`}
          >
            Read More
          </button>
        </Link>
      </CardFooter>
    </Card>
  </div>
);


// ─── Stats section ────────────────────────────────────────────────────────────

const stats = [
  {
   icon: (
  <svg width="100" height="80" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradReverse" x1="60" y1="0" x2="60" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#162456" />
        <stop offset="100%" stopColor="#2B7FFF" />
      </linearGradient>
      <mask id="gapMask">
        <rect width="120" height="110" fill="white" />
        {/* Enlarged mask shapes = bigger gap around center person */}
        <circle cx="60" cy="30" r="22" fill="black" stroke="black" strokeWidth="10" />
        <path d="M22 110 Q22 55 60 55 Q98 55 98 110Z" fill="black" stroke="black" strokeWidth="15" strokeLinejoin="round" />
      </mask>
    </defs>

    {/* Side figures — paths clamped to x=0 and x=120 so no hard viewport cut */}
    <g mask="url(#gapMask)">
      <circle cx="20" cy="45" r="16" fill="url(#blueGradReverse)" />
      <path d="M0 110 Q0 70 20 70 Q50 70 50 110Z" fill="url(#blueGradReverse)" />

      <circle cx="100" cy="45" r="16" fill="url(#blueGradReverse)" />
      <path d="M70 110 Q70 70 100 70 Q120 70 120 110Z" fill="url(#blueGradReverse)" />
    </g>

    {/* Center figure on top */}
    <circle cx="60" cy="30" r="22" fill="url(#blueGradReverse)" />
    <path d="M22 110 Q22 55 60 55 Q98 55 98 110Z" fill="url(#blueGradReverse)" />
  </svg>
),
    value: "100+",
    label: "Members Empowered",
  },
  {
    icon: (
      <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="redGrad" x1="60" y1="0" x2="60" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#82181A" />
            <stop offset="100%" stopColor="#EA4335" />
          </linearGradient>
        </defs>
        <rect width="120" height="100" rx="16" fill="url(#redGrad)" />
        <polyline points="32,35 14,50 32,65" stroke="#111" strokeWidth="11" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
        <polyline points="88,35 106,50 88,65" stroke="#111" strokeWidth="11" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
        <line x1="68" y1="28" x2="52" y2="72" stroke="#111" strokeWidth="11" strokeLinecap="square" />
      </svg>
    ),
    value: "200+",
    label: "Study Jam",
  },
  {
    icon: (
      <svg width="100" height="80" viewBox="0 0 110 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="greenGrad" x1="55" y1="0" x2="55" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C950" />
            <stop offset="100%" stopColor="#016630" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="48" r="40" fill="url(#greenGrad)" />
        <circle cx="55" cy="48" r="26" fill="#111" />
        <circle cx="55" cy="48" r="18" fill="url(#greenGrad)" />
        <path d="M35 78 L35 115 L55 100 L75 115 L75 78Z" fill="url(#greenGrad)" />
        <path d="M35 115 L55 100 L75 115" fill="#111" />
      </svg>
    ),
    value: "4+",
    label: "Years of Innovation",
  },
];

const nexusStroke = "linear-gradient(to right, #EA4335, #F9AB00, #34A853, #4285F4)";

const StatCard = ({
  stat,
}: {
  stat: (typeof stats)[number];
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = useState(0);

  const match = stat.value.match(/^(\d+)(.*)$/);
  const targetValue = Number(match?.[1] ?? 0);
  const suffix = match?.[2] ?? "";

  useEffect(() => {
    if (!isInView) return;

    let frameId = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frameId = requestAnimationFrame(() => setDisplayValue(targetValue));
      return () => cancelAnimationFrame(frameId);
    }

    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.round(targetValue * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, targetValue]);

  return (
    <div
      ref={ref}
      className="p-[1.5px] rounded-2xl"
      style={{ background: nexusStroke }}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl p-8 h-full bg-[#0F0E0E]">
        {stat.icon}
        <Text variant="heading-1" weight="bold" align="center" className="text-white">
          {`${displayValue}${suffix}`}
        </Text>
        <Text variant="body" weight="bold" align="center" className="text-gray-300">
          {stat.label}
        </Text>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export function HistorySection() {
  return (
    <div className="relative overflow-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16 bg-[#0F0E0E]">
      {/* Zoned blob background — pinned per region, history page only */}
      <HistoryBlobBackground />

{/* Orbital rings */}
<div className="absolute pointer-events-none"
  style={{ top: "12%", left: "50%", transform: "translateX(-50%)", width: "70%", opacity: 0.9 }}>
  <Image src="/about/history/bg-orbital-rings.png" alt="" width={900} height={900} className="w-full h-auto" />
</div>

{/* Gear */}
<div className="absolute pointer-events-none hidden lg:block"
  style={{ top: "45%", right: "-8%", width: "25%", opacity: 0.20 }}>
  <Image src="/about/history/bg-gear.png" alt="" width={400} height={400} className="w-full h-auto" />
</div>

{/* Star */}
<div className="absolute pointer-events-none hidden lg:block"
  style={{ top: "55%", left: "-15%", width: "50%", opacity: 0.20, transform: "rotate(20deg)" }}>
  <Image src="/about/history/bg-star.webp" alt="" width={300} height={300} className="w-full h-auto" />
</div>

    <Container maxWidth="7xl" padding="lg" className="relative z-10 w-full overflow-hidden">        <Stack gap="2xl">
          {/* Section 1 — Hero */}
          <FadeInSection className="mb-32">
            <Stack gap="lg" align="center">
              <Text
                as="h1"
                variant="heading-1"
                weight="bold"
                align="center"
                gradient="white-green"
                className="w-full max-w-4xl"
              >
                A Journey Through GDG PUP Milestones
              </Text>

            <div className="w-full max-w-5xl mx-auto border border-white rounded-2xl px-8 py-6">                <Text
                  variant="body"
                  align="center"
                  className="text-white text-lg"
                >
                Over two hundred students in PUP showed up to something that
                didn&apos;t exist yet, drawn by Google&apos;s name alone. August
                28, 2022. A Facebook page had just gone live. No track record,
                no proven value, just a promise: we&apos;re building a space
                where PUP students turn ideas into real projects.
              </Text>
            </div>
            </Stack>
          </FadeInSection>

         {/* Section 2 — History Cards */}
      <FadeInSection delay={0.1} className="mb-32">
        <div className="w-full">
          {/* ── Mobile layout ────────────────────────────────────── */}
          <div className="flex flex-col gap-4 w-full lg:hidden">
            {milestones.map((milestone) => (
              <div key={milestone.slug} className="w-full">
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
          </div>

          {/* Desktop staircase layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 w-full items-start">
            {/* Col 1 — The Spark → Your Chapter */}
            <div className="flex flex-col">
              <AnimatedCard>
                <MilestoneCard milestone={milestones[0]} />
              </AnimatedCard>
              <div className="lg:mt-[52rem]">
                <AnimatedCard>
                  <MilestoneCard milestone={milestones[6]} />
                </AnimatedCard>
              </div>
            </div>

            {/* Col 2 — Year One → The Living Community */}
            <div className="flex flex-col lg:pt-[10rem]">
              <AnimatedCard>
                <MilestoneCard milestone={milestones[1]} />
              </AnimatedCard>
              <div className="lg:mt-[32rem]">
                <AnimatedCard>
                  <MilestoneCard milestone={milestones[5]} />
                </AnimatedCard>
              </div>
            </div>

            {/* Col 3 — Year Two → The Impact */}
            <div className="flex flex-col lg:pt-[20rem]">
              <AnimatedCard>
                <MilestoneCard milestone={milestones[2]} />
              </AnimatedCard>
              <div className="lg:mt-[12rem]">
                <AnimatedCard>
                  <MilestoneCard milestone={milestones[4]} />
                </AnimatedCard>
              </div>
            </div>

            {/* Col 4 — Year Three: deepest */}
            <div className="lg:pt-[37rem]">
              <AnimatedCard>
                <MilestoneCard milestone={milestones[3]} />
              </AnimatedCard>
            </div>
          </div>
        </div>
      </FadeInSection>

          {/* ── Section 3: Stats + CTA ───────────────────────────── */}
<FadeInSection delay={0.2}>
  <Stack gap="xl" align="center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
    <Box>
      <Link href="/signup">
        <Button size="lg" variant="default">
          Join Our Journey
        </Button>
      </Link>
    </Box>
  </Stack>
</FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}
