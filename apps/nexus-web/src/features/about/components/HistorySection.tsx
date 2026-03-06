/* For improvements:
 *
 * Revamp the whole page because this is just the initial design.
 * Add decorative elements based on figma
 * Proper image sizing and optimization
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
import { useEffect, useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";

// ─── Zoned blob background (history page only) ───────────────────────────────
// Each blob is pinned to its own vertical region and drifts independently.
// Regions (top → bottom): green · yellow · blue · red

/** Motion patterns available for each blob */
type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

// ── Edit these values to tune the blobs ─────────────────────────────────────
const BLOBS = {
  green: {
    // Size & position
    width: 420, height: 420,
    top: 475, left: "calc(85% - 350px)" as const,
    // Appearance
    color: "#4DB368CC",   // last 2 hex = opacity  CC=80%  99=60%  66=40%
    blur: 200,            // px — lower=more visible, higher=softer
    // Movement
    motion: "vertical" as BlobMotion,  // "vertical" | "horizontal" | "diagonal" | "none"
    duration: 88,         // seconds for one full cycle
    travel: 38,           // px — max drift distance
    delay: "0s",
    // Interactivity
    interactive: true,   // true = blob subtly follows the mouse
    interactiveStrength: 0.18, // 0–1, how strongly it follows (0.04 = very subtle)
  },
  yellow: {
    width: 640, height: 640,
    top: 760, left: "calc(38% - 80px)" as const,
    color: "#F9AB00B3",   // B3=70%
    blur: 210,
    motion: "horizontal" as BlobMotion,
    duration: 58,
    travel: 34,
    delay: "-14s",
    interactive: false,
    interactiveStrength: 0.04,
  },
  blue: {
    width: 600, height: 600,
    top: 1280, left: "calc(5% - 60px)" as const,
    color: "#4285F4B3",   // B3=70%
    blur: 310,
    motion: "diagonal" as BlobMotion,
    duration: 80,
    travel: 28,
    delay: "-30s",
    interactive: true,
    interactiveStrength: 0.35,
  },
  red: {
    width: 500, height: 500,
    top: 2020, right: "calc(5% - 80px)" as const,
    color: "#EA4335BF",   // BF=75%
    blur: 210,
    motion: "horizontal" as BlobMotion,
    duration: 96,
    travel: 38,
    delay: "-48s",
    interactive: false,
    interactiveStrength: 0.04,
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

      {/* ── Blue — below yellow, further left ── */}
      <motion.div
        ref={blueRef}
        style={blobStyle(BLOBS.blue, { top: BLOBS.blue.top, left: BLOBS.blue.left })}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
      />

      {/* ── Red — below blue, right side ── */}
      <motion.div
        ref={redRef}
        style={blobStyle(BLOBS.red, { top: BLOBS.red.top, right: BLOBS.red.right })}
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
    excerpt:
      "Tech students at PUP had a problem. The university taught theory. Textbooks covered concepts but gave no space to build.",
  },
  {
    slug: "year-one",
    title: "Year One: Everything at Once",
    excerpt:
      "Six tech teams formed in those first months. Data Science, Web Dev, Mobile, Cloud, Design, and Competitive Programming — all in Year One.",
  },
  {
    slug: "year-two",
    title: "Year Two: The Test",
    excerpt:
      "Departmental exams returned to CCIS and attendance dropped across campus orgs. GDG PUP held ground by doubling down on quality.",
  },
  {
    slug: "year-three",
    title: "Year Three: The Turnaround",
    excerpt:
      "Xian Cheng took over as Lead. Francis Chuaunsu continued as CEO. The org leaned into community-building and external partnerships.",
  },
  {
    slug: "the-impact",
    title: "The Impact",
    excerpt:
      "Numbers tell part of the story. Over 2,000 members trained across three years, study jams every month, and a growing network of partners.",
  },
  {
    slug: "living-community",
    title: "The Living Community",
    excerpt:
      "Year four arrived with new leaders ready to step up. Randy Lorenzo took the helm and the chapter kept growing — for the students, by the students.",
  },
];

// Single milestone card — thumbnail + title + excerpt + Read More button
const MilestoneCard = ({
  milestone,
}: {
  milestone: (typeof milestones)[number];
}) => (
  <Card>
    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden mb-2">
      <Image
        src={ASSETS.HOME.HERO.LAYER_BG}
        alt={milestone.title}
        fill
        className="object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
    <CardHeader>
      <CardTitle>{milestone.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <Text variant="body-sm" className="text-gray-300">
        {milestone.excerpt}
      </Text>
    </CardContent>
    <CardFooter>
      <Link href="#">
        <Button variant="default" size="sm">
          Read More
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export function HistorySection() {
  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Zoned blob background — pinned per region, history page only */}
      <HistoryBlobBackground />

      <Container maxWidth="7xl" padding="lg" className="relative z-10">
        <Stack gap="2xl">
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

              <Text
                variant="body"
                align="center"
                className="text-white max-w-3xl mx-auto"
              >
                Over two hundred students in PUP showed up to something that
                didn&apos;t exist yet, drawn by Google&apos;s name alone. August
                28, 2022. A Facebook page had just gone live. No track record,
                no proven value, just a promise: we&apos;re building a space
                where PUP students turn ideas into real projects.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Section 2 — History Cards */}
          <FadeInSection delay={0.1} className="mb-32">
            <Stack gap="xl" align="center">
              {/* ── Mobile layout ────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-4 w-full lg:hidden">
                {milestones.map((milestone) => (
                  <AnimatedCard key={milestone.slug}>
                    <MilestoneCard milestone={milestone} />
                  </AnimatedCard>
                ))}
                <AnimatedCard>
                  <Card className="opacity-50">
                    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden mb-2 bg-white/5" />
                    <CardHeader>
                      <CardTitle>More Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text variant="body-sm" className="text-gray-400">
                        The journey doesn&apos;t stop here. New chapters are
                        still being written.
                      </Text>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </div>

              {/* ── Desktop staircase ─────────────────────────────────── */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-6 w-full items-start">
                {/* Col 1 — Year Three: deepest */}
                <div className="lg:pt-[37rem]">
                  <AnimatedCard>
                    <MilestoneCard milestone={milestones[3]} />
                  </AnimatedCard>
                </div>

                {/* Col 2 — Year Two (row 1) → The Impact (row 2) */}
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

                {/* Col 3 — Year One (row 1) → The Living Community (row 2) */}
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

                {/* Col 4 — The Spark (row 1) → Coming Soon (row 2) */}
                <div className="flex flex-col">
                  <AnimatedCard>
                    <MilestoneCard milestone={milestones[0]} />
                  </AnimatedCard>
                  <div className="lg:mt-[52rem]">
                    <AnimatedCard>
                      <Card className="opacity-50">
                        <div className="relative w-full aspect-video rounded-[20px] overflow-hidden mb-2 bg-white/5" />
                        <CardHeader>
                          <CardTitle>More Coming Soon</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Text variant="body-sm" className="text-gray-400">
                            The journey doesn&apos;t stop here. New chapters are
                            still being written.
                          </Text>
                        </CardContent>
                      </Card>
                    </AnimatedCard>
                  </div>
                </div>
              </div>
            </Stack>
          </FadeInSection>

          {/* Section 3 — Statistics */}
          <FadeInSection delay={0.2}>
            <Stack gap="xl" align="center">
              <Grid className="grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                <Stack align="center" gap="xs">
                  <Text
                    variant="heading-1"
                    weight="bold"
                    gradient="white-green"
                    align="center"
                  >
                    100+
                  </Text>
                  <Text
                    variant="body"
                    weight="bold"
                    align="center"
                    className="text-white"
                  >
                    Members Empowered
                  </Text>
                </Stack>

                <Stack align="center" gap="xs">
                  <Text
                    variant="heading-1"
                    weight="bold"
                    gradient="white-green"
                    align="center"
                  >
                    200+
                  </Text>
                  <Text
                    variant="body"
                    weight="bold"
                    align="center"
                    className="text-white"
                  >
                    Study Jams
                  </Text>
                </Stack>

                <Stack align="center" gap="xs">
                  <Text
                    variant="heading-1"
                    weight="bold"
                    gradient="white-green"
                    align="center"
                  >
                    4+
                  </Text>
                  <Text
                    variant="body"
                    weight="bold"
                    align="center"
                    className="text-white"
                  >
                    Years of Innovation
                  </Text>
                </Stack>
              </Grid>

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
