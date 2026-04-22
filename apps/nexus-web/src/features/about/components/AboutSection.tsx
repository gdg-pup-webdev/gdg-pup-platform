"use client";

import { Box, Stack, Grid, Container, Text, Card } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";
import { AboutHeroStage } from "./AboutHeroStage";

// Animation wrapper component for fade-in on scroll
const FadeInSection = ({
  children,
  delay = 0,
  withY = true,
}: {
  children: React.ReactNode;
  delay?: number;
  withY?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: withY ? 50 : 0 }}
      animate={
        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: withY ? 50 : 0 }
      }
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export function AboutSection() {
  return (
    <div className="relative overflow-x-clip pt-32 md:pt-48 pb-16 md:pb-28 px-4 md:px-8 lg:px-16">
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

      {/* Decorative Element 1 - Right Side */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          right: "max(calc((100vw - 60rem) / 2 - 250px), 20px)",
          top: "calc(8rem + 50px)",
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        <Image
          src={ASSETS.ABOUT.WHO.DECOR_ELEMENT_1}
          alt="Decorative element 1"
          width={120}
          height={120}
        />
      </div>

      {/* Decorative Element 2 - Right Side Lower */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          width: "min(350px, 20vw)",
          right: "max(calc((100vw - 90rem) / 2 - 500px), 30px)",
          top: "calc(1rem + 1300px)",
          zIndex: 1,
        }}
      >
        <Image
          src={ASSETS.ABOUT.WHO.DECOR_ELEMENT_2}
          alt="Decorative element 2"
          width={250}
          height={250}
          style={{ opacity: 0.75 }}
        />
      </div>

      <Container maxWidth="7xl" padding="lg" className="relative">
        <Stack gap="2xl">
          {/* Section 1: Hero Header */}
          <FadeInSection>
            <Stack gap="lg" align="center" className="lg:mb-20">
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
                    <span className="text-blue-600 font-semibold">
                      Google Developer Groups on Campus Polytechnic University
                      of the Philippines (GDG PUP)
                    </span>{" "}
                    is a student-driven organization supported by{" "}
                    <span className="text-green-600 font-semibold">
                      Google Developers
                    </span>
                    . We exist to create a collaborative space where students
                    can learn, build, and grow through technology.
                  </Text>
                </Card>
              </Box>
            </Stack>
          </FadeInSection>

          {/* Section 2: Hero Media */}
          <FadeInSection delay={0.2}>
            <div className="relative w-full flex justify-center lg:mb-28">
              {/* Spiral decoration anchored to BOTTOM of video */}
              <div
                className="absolute pointer-events-none z-0"
                style={{
                  width: "min(1800px, 100vw)",
                  left: "50%",
                  top: "90%",
                  transform: "translate(-50%, -15%)",
                  opacity: 0.9,
                }}
              >
                <Image
                  src={ASSETS.ABOUT.WHO.SPIRAL}
                  alt="Spiral decoration"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                />
              </div>

              <Box
                className="relative aspect-video rounded-3xl overflow-hidden w-full z-10"
                style={{
                  boxShadow: "0px 10px 50px 0px #EA443480",
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
            </div>
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
            <Stack
              gap="lg"
              className="w-full md:flex md:flex-row md:items-center lg:grid-cols-3 lg:grid"
            >
              {/* Left: Image/Illustration */}
              <Box className="flex justify-center lg:col-span-1 lg:justify-end">
                <Box className="relative w-40 h-40 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [-12, 12, -12] }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full"
                  >
                    <Image
                      src={ASSETS.ABOUT.WHO.MASCOT_1}
                      alt="Mission - Cirby"
                      width={400}
                      height={400}
                      className="w-full h-full object-contain pointer-events-none"
                      style={{
                        filter:
                          "drop-shadow(0 10px 30px rgba(66, 133, 244, 0.3))",
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>

              {/* Right: Content */}
              <Stack
                gap="lg"
                className="lg:col-span-2 items-center md:items-start lg:items-start"
              >
                <Text
                  as="h2"
                  variant="heading-2"
                  gradient="white-blue"
                  align="center"
                  className="md:text-left"
                >
                  Mission
                </Text>

                <Card>
                  <Text
                    variant="body"
                    align="center"
                    className="text-gray-300 text-base md:text-lg leading-relaxed md:text-left"
                  >
                    To build an inclusive and supportive student community that
                    empowers learners to transform technical knowledge into
                    real-world impact through collaboration, innovation, and
                    continuous learning.
                  </Text>
                </Card>
              </Stack>
            </Stack>
          </FadeInSection>

          {/* Section 5: Our Values */}
          <FadeInSection delay={0.1} withY={false}>
            <Stack
              gap="xl"
              className="w-full md:flex md:flex-row md:items-start md:gap-2xl"
            >
              {/* Left: Content */}
              <Stack gap="2xl" className="md:w-1/2 items-center md:mr-10">
                {/* mobile mascot above values */}
                <Box className="md:hidden w-full scale-75 origin-center -mb-26 -mt-12 relative h-auto flex items-center justify-center">
                  <AboutHeroStage />
                </Box>
                <Text
                  as="h2"
                  variant="heading-2"
                  gradient="white-blue"
                  align="center"
                  className="md:text-left"
                >
                  Our Values
                </Text>

                <div className="flex gap-4 items-center">
                  <div className="shrink-0 pt-2 pointer-events-none hidden sm:block">
                    <Image
                      src={ASSETS.ABOUT.WHO.CARD_BULLET}
                      alt="Bullet"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <Card>
                    <Text
                      variant="heading-5"
                      gradient="vibrant-blue"
                      weight="bold"
                      align="center"
                      className="sm:text-left"
                    >
                      Community-Driven Learning
                    </Text>
                    <Text
                      variant="body"
                      align="center"
                      className="text-gray-300 text-base md:text-lg leading-relaxed sm:text-left"
                    >
                      <span className="italic font-bold">
                        We believe learning is most powerful when it&apos;s
                        shared.{" "}
                      </span>
                      GDG PUP fosters a culture of peer-to-peer growth where
                      students collaborate, exchange ideas openly, and grow
                      together. Through Study Jams, workshops, departmental
                      skill-shares, mini-hackathons, and industry-partnered
                      experiences, we create spaces where everyone contributes,
                      everyone learns, and every breakthrough is a shared win.
                    </Text>
                  </Card>
                </div>
                <div className="flex gap-4 items-center">
                  {/* bullet icon only on sm+ */}
                  <div className="shrink-0 pt-2 pointer-events-none hidden sm:block">
                    <Image
                      src={ASSETS.ABOUT.WHO.CARD_BULLET}
                      alt="Bullet"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <Card>
                    <Text
                      variant="heading-5"
                      gradient="vibrant-blue"
                      weight="bold"
                      align="center"
                      className="sm:text-left"
                    >
                      Learning by Doing
                    </Text>
                    <Text
                      variant="body"
                      align="center"
                      className="text-gray-300 text-base md:text-lg leading-relaxed sm:text-left"
                    >
                      <span className="italic font-bold">
                        We turn concepts into real solutions.{" "}
                      </span>
                      GDG PUP emphasizes hands-on experiences—workshops,
                      projects, and real applications—so students can turn
                      theory into practice and build confidence in their skills.
                    </Text>
                  </Card>
                </div>
                <div className="flex gap-4 items-center">
                  {/* bullet icon only on sm+ */}
                  <div className="shrink-0 pt-2 pointer-events-none hidden sm:block">
                    <Image
                      src={ASSETS.ABOUT.WHO.CARD_BULLET}
                      alt="Bullet"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <Card>
                    <Text
                      variant="heading-5"
                      gradient="vibrant-blue"
                      weight="bold"
                      align="center"
                      className="sm:text-left"
                    >
                      Inclusivity and Growth
                    </Text>
                    <Text
                      variant="body"
                      align="center"
                      className="text-gray-300 text-base md:text-lg leading-relaxed sm:text-left"
                    >
                      <span className="italic font-bold">
                        We build an inclusive community for all learners.{" "}
                      </span>
                      GDG PUP is open to students of all skill levels. Whether
                      you&apos;re a beginner or an experienced developer,
                      there&apos;s a place for you to learn, contribute, and
                      grow. confidence in their skills.
                    </Text>
                  </Card>
                </div>
                <div className="flex gap-4 items-center">
                  {/* bullet icon only on sm+ */}
                  <div className="shrink-0 pt-2 pointer-events-none hidden sm:block">
                    <Image
                      src={ASSETS.ABOUT.WHO.CARD_BULLET}
                      alt="Bullet"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <Card>
                    <Text
                      variant="heading-5"
                      gradient="vibrant-blue"
                      weight="bold"
                      align="center"
                      className="sm:text-left"
                    >
                      Innovation with Purpose
                    </Text>
                    <Text
                      variant="body"
                      align="center"
                      className="text-gray-300 text-base md:text-lg leading-relaxed sm:text-left"
                    >
                      <span className="italic font-bold">
                        We build and design for the people.{" "}
                      </span>
                      GDG PUP encourages creativity and problem-solving, guiding
                      students to develop technological solutions that can
                      positively impact communities and society.
                    </Text>
                  </Card>
                </div>
              </Stack>

              {/* Right: Image/Illustration */}
              <Box className="hidden sm:flex justify-center md:w-1/2 sticky top-48 self-start">
                <AboutHeroStage />
              </Box>
            </Stack>
          </FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}
