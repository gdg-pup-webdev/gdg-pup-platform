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
import { useRef } from "react";

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
        src="/pages/hero/BG2.png"
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
      {/* Decorative Ellipse - Top Left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1091px, 70vw)",
          height: "min(950px, 80vh)",
          top: "calc(8rem - 369px)",
          left: "max(calc((100vw - 80rem) / 2 + 36px), 36px)",
          background: "#4285F433",
          opacity: 1,
          filter: "blur(579.0999755859375px)",
          WebkitFilter: "blur(579.0999755859375px)",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1003.654495437601px, 65vw)",
          height: "min(1129.0127127002554px, 85vh)",
          top: "calc(8rem + 137.79px)",
          right: "max(calc((100vw - 80rem) / 2 - 400px), -200px)",
          background: "#4285F433",
          opacity: 1,
          filter: "blur(579.0999755859375px)",
          WebkitFilter: "blur(579.0999755859375px)",
          transform: "rotate(-39.16deg)",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Bottom Left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(792px, 50vw)",
          height: "min(640px, 60vh)",
          top: "calc(8rem + 694px)",
          left: "max(calc((100vw - 80rem) / 2 - 234px), -200px)",
          background: "#4285F433",
          opacity: 1,
          filter: "blur(579.0999755859375px)",
          WebkitFilter: "blur(579.0999755859375px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="7xl" padding="lg" className="relative">
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
