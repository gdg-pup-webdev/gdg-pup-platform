/* For improvements:
 *
 * Revamp the whole page because this is just the initial design.
 * Revamp the buttons here according to figma design
 * Add decorative elements based on figma
 * Proper image sizing and optimization
 * Add animations and interactions based on figma
 * Add real links to the CTA buttons
 */
"use client";

import {
  Box,
  Stack,
  Grid,
  Container,
  Text,
  Card,
  Button,
} from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

// Animation wrapper — same pattern as AboutSection
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

const partners = [
  { name: "Acadarena", slug: "acadarena", ext: "png" },
  { name: "DataCamp", slug: "datacamp", ext: "png" },
  { name: "YSpace", slug: "yspace", ext: "png" },
  { name: "Pocky", slug: "pocky", ext: "png" },
  { name: "PLDT", slug: "pldt", ext: "png" },
  { name: "Globe", slug: "globe", ext: "png" },
  { name: "Mountain Dew", slug: "mountain-dew", ext: "png" },
  { name: "Whitecloak", slug: "whitecloak", ext: "png" },
  { name: "FlowerStore.ph", slug: "flowerstore", ext: "png" },
  { name: "Potico.ph", slug: "potico", ext: "png" },
  { name: "v0", slug: "v0", ext: "png" },
  { name: "Hey Roomie", slug: "hey-roomie", ext: "png" },
  { name: "Homeroom", slug: "homeroom", ext: "jpg" },
  { name: "Gen AI Philippines", slug: "gen-ai-philippines", ext: "jpg" },
];

export function PartnershipSection() {
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
                gradient="white-yellow"
                className="w-full max-w-4xl"
              >
                Innovation Through Collaboration
              </Text>

              <Text
                variant="body"
                align="center"
                className="text-white max-w-3xl mx-auto"
              >
                We collaborate with forward-thinking organizations to foster
                innovation, deliver meaningful programs, and bridge the gap
                between technology and community. Together, we build platforms
                that inspire developers, nurture talent, and shape future-ready
                leaders.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Section 2 — Why We Do This */}
          <FadeInSection delay={0.1} className="mb-32">
            <Stack gap="lg" align="center">
              <Text
                variant="heading-2"
                weight="bold"
                align="center"
                gradient="white-yellow"
              >
                WHY WE DO THIS
              </Text>

              <Text
                as="h3"
                variant="heading-3"
                weight="bold"
                align="center"
                className="text-white"
              >
                Creating value through trust and shared purpose
              </Text>

              <Box className="w-full max-w-3xl mx-auto">
                <Card>
                  <Text variant="body" className="text-gray-300 text-center">
                    <span className="bg-linear-[0deg,#57CAFF_0%,#347999_100%] bg-clip-text text-transparent font-semibold">
                      Google Developer Group PUP Nexus
                    </span>{" "}
                    exists to cultivate a collaborative tech community where
                    students and professionals grow together. Through
                    partnerships built on{" "}
                    <span className="bg-linear-[360deg,#FFD427_0%,#997F17_100%] bg-clip-text text-transparent font-semibold">
                      trust and shared goals
                    </span>
                    , we create meaningful opportunities for{" "}
                    <span className="bg-linear-[360deg,#5CDB6D_0%,#31753A_100%] bg-clip-text text-transparent font-semibold">
                      learning, innovation, and real-world impact.
                    </span>
                  </Text>
                </Card>
              </Box>
            </Stack>
          </FadeInSection>

          {/* Section 3 — Partners Grid */}
          <FadeInSection delay={0.15} className="mb-32">
            <Stack gap="xl" align="center">
              <Text
                variant="heading-4"
                weight="bold"
                align="center"
                gradient="white-yellow"
              >
                POWERED BY OUR PARTNERS
              </Text>

              <Grid className="grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {partners.map((partner) => (
                  <Box
                    key={partner.slug}
                    className="flex items-center justify-center rounded-xl bg-white/10 p-4 aspect-[3/2]"
                  >
                    <div className="relative w-full h-12">
                      <Image
                        src={`/pages/about/partnership/${partner.slug}.${partner.ext}`}
                        alt={partner.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          // Hide broken image — placeholder tile shows via bg-white/10
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </Box>
                ))}
              </Grid>
            </Stack>
          </FadeInSection>

          {/* Section 4 — CTA Card */}
          <FadeInSection delay={0.2}>
            <Card>
              <Grid className="md:grid-cols-2 items-center gap-8">
                {/* Left: Copy + CTA */}
                <Stack gap="md">
                  <Text
                    as="h2"
                    variant="heading-2"
                    weight="bold"
                    gradient="white-yellow"
                  >
                    Ready to Partner With Us?
                  </Text>

                  <Text variant="body" className="text-gray-300">
                    Let&apos;s build something impactful together. By partnering
                    with GDG PUP, you gain access to a dynamic community of
                    aspiring developers, innovators, and changemakers eager to
                    learn, collaborate, and create solutions that matter.
                  </Text>

                  <Box>
                    <Link href="#">
                      <Button size="lg" variant="default">
                        Join Now
                      </Button>
                    </Link>
                  </Box>
                </Stack>

                {/* Right: Mascot */}
                <Box className="flex justify-center">
                  <div className="relative w-72 h-72">
                    <Image
                      src="/pages/about/partnership/cirby-sticker.png"
                      alt="GDG PUP Mascot"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Box>
              </Grid>
            </Card>
          </FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}
