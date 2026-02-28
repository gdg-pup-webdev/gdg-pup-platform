/* For improvements:
 *
 * Add decorative elements based on figma
 * Swap BG2.png placeholders with real per-benefit artwork when assets are ready
 * Add real link for "Get ID" button if the route changes
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
  CardContent,
  Button,
} from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

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

const benefits = [
  {
    title: "Google Access",
    body: "Access to Google-backed learning resources, tools, and technologies.",
  },
  {
    title: "Hands-On",
    body: "Hands-on workshops, Study Jams, Departmental skill-shares and real-world projects.",
  },
  {
    title: "Mentorship",
    body: "Opportunities to connect with industry professionals and mentors through our partnered initiatives.",
  },
  {
    title: "Growth Network",
    body: "A global GDG network you can grow with—even after graduation.",
  },
  {
    title: "Leadership",
    body: "Leadership, collaboration, and career-building experiences.",
  },
  {
    title: "Community",
    body: "Vibrant community where meaningful connections, valuable networks, and unforgettable experiences happen naturally. We grow, laugh, and build together.",
  },
];

export function BenefitsSection() {
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
                gradient="white-blue"
              >
                GDG on TOP
              </Text>

              <Text variant="body" align="center" className="text-white ">
                Being part of GDG PUP means more than joining an
                organization—it&apos;s about gaining access to opportunities
                that help you grow as a developer, a leader, and a professional.
                As a member, you&apos;re connected to a global network supported
                by your own peers and industry professionals, with experiences
                designed to help you learn, build, and stand out.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Section 2 — Benefits Grid */}
          <FadeInSection delay={0.1} className="mb-32">
            <Stack gap="xl" align="center">
              <Text
                variant="heading-3"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                WHAT BEING AN OFFICIAL GOOGLER INCLUDES
              </Text>

              <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {benefits.map((benefit) => (
                  <Card key={benefit.title}>
                    <CardHeader>
                      <Text
                        variant="heading-6"
                        weight="semibold"
                        align="center"
                        className="text-white"
                      >
                        {benefit.title}
                      </Text>
                    </CardHeader>
                    <CardContent>
                      <Text variant="body-sm" align="center" className="text-gray-300">
                        {benefit.body}
                      </Text>
                    </CardContent>
                    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden mt-2">
                      <Image
                        src="/pages/hero/BG2.png"
                        alt={benefit.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </FadeInSection>

          {/* Section 3 — CTA */}
          <FadeInSection delay={0.2}>
            <Stack gap="lg" align="center">
              <Text
                as="h3"
                variant="heading-3"
                weight="bold"
                align="center"
                className="text-white"
              >
                YOUR JOURNEY STARTS HERE
              </Text>

              <Text variant="body" align="center" className="text-gray-300">
                Become a member, earn your GDG ID and start reaping the
                benefits!
              </Text>

              <Box>
                <Link href="/id">
                  <Button size="lg" variant="default">
                    Get ID
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
