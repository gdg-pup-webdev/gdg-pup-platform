"use client";

import {
  Box,
  Stack,
  Grid,
  Container,
  Text,
  Button,
  Card,
} from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

// Animation wrapper component for fade-in on scroll
const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function WhoIsGDGPage() {
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

      {/* Spiral Stand Decoration - positioned below video */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 950,
        }}
      >
        <Image
          src="/pages/who-is-gdg/Spiral.png"
          alt="Spiral decoration"
          width={1200}
          height={800}
          className="w-full h-auto opacity-90"
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      <Container maxWidth="7xl" padding="lg" className="relative">
        <Stack gap="2xl">
          {/* Section 1: Hero Header */}
          <FadeInSection>
            <Stack gap="lg" align="center">
              <Text
                as="h1"
                variant="heading-2"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                Who is GDG PUP?
              </Text>

              <Box>
                <Card>
                  <Text
                    variant="body"
                    align="center"
                    className="text-white text-lg md:text-xl"
                  >
                    <span className="text-blue-600 font-semibold">Google Developer Groups on Campus Polytechnic University of
                    the Philippines (GDG PUP)</span> is a student-driven organization
                    supported by <span className="text-green-600 font-semibold">Google Developers</span>. We exist to create a
                    collaborative space where students can learn, build, and
                    grow through technology.
                  </Text>
                </Card>
              </Box>
            </Stack>
          </FadeInSection>

          {/* Section 2: Hero Media */}
          <FadeInSection delay={0.2}>
            <Box
              className="relative aspect-video rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0px 10px 50px 0px #EA443480",
                zIndex: 10,
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/HMQjlHLlmwM?si=yZRjYhCsDY1lee1h"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0"
              />
            </Box>
          </FadeInSection>

          {/* Section 3: Hero Description */}
          <FadeInSection delay={0.3}>
            <Stack gap="md">
              <Text variant="body" align="center" className="text-white">
                GDG PUP brings together students from all backgrounds who share
                the same spark: a genuine curiosity to explore technology beyond
                the classroom and the drive to build real, lasting connections
                along the way. Through events, workshops, and hands-on projects,
                we help members develop technical skills, gain real-world
                experience, and prepare for careers in tech.
              </Text>

              <Text variant="body" align="center" className="text-white">
                As part of the global Google Developer Groups on Campus network,
                our members gain access to learning opportunities, tools, and a
                community that extends beyond the university.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Section 4: Mission */}
          <FadeInSection delay={0.1}>
            <Grid gap="2xl" className="md:grid-cols-2 items-center">
              {/* Left: Image/Illustration */}
              <Box className="flex justify-center">
                <Box className="relative w-80 h-80 flex items-center justify-center">
                  <Image
                    src="/pages/who-is-gdg/mascot1.png"
                    alt="Mission - Cirby"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    style={{
                      filter:
                        "drop-shadow(0 10px 30px rgba(66, 133, 244, 0.3))",
                    }}
                  />
                </Box>
              </Box>

              {/* Right: Content */}
              <Stack gap="lg">
                <Text as="h2" variant="heading-2" gradient="white-blue">
                  Mission
                </Text>

                <Card>
                  <Text
                    variant="body"
                    className="text-gray-300 text-base md:text-lg leading-relaxed"
                  >
                    To build an inclusive and supportive student community that
                    empowers learners to transform technical knowledge into
                    real-world impact through collaboration, innovation, and
                    continuous learning.
                  </Text>
                </Card>
              </Stack>
            </Grid>
          </FadeInSection>

          {/* Section 5: Our Values */}
          <FadeInSection delay={0.1}>
            <Grid gap="2xl" className="md:grid-cols-2 items-center">
              {/* Left: Content */}
              <Stack gap="lg">
                <Text as="h2" variant="heading-2" gradient="white-blue">
                  Our Values
                </Text>

                <Card>
                  <Text
                    variant="body"
                    className="text-gray-300 text-base md:text-lg leading-relaxed"
                  >
                    To build an inclusive and supportive student community that
                    empowers learners to transform technical knowledge into
                    real-world impact through collaboration, innovation, and
                    continuous learning.
                  </Text>
                </Card>
              </Stack>

              {/* Right: Image/Illustration */}
              <Box className="flex justify-center">
                <Box className="relative w-80 h-80 flex items-center justify-center">
                  <Image
                    src="/pages/who-is-gdg/mascot2.png"
                    alt="Our Values - Sparky Flying"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    style={{
                      filter: "drop-shadow(0 10px 30px rgba(234, 67, 53, 0.3))",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}
