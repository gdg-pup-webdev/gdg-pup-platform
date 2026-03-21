"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";
import { FrostedContentContainer } from "./frosted-content-container";

export function WhoAreWeSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="relative z-30 pb-20 lg:py-34" ref={sectionRef}>
      <Container className="">
        <Stack gap="2xl" align="center">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          >
            <Text
              as="h2"
              align="center"
              gradient="white-yellow"
              variant="heading-2"
              weight="bold"
              className="mt-30 mb-10 lg:my-0"
            >
              Who are we
            </Text>
          </motion.div>

          {/* Two-column layout: Sparky image + text */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8.5 w-full">
            {/* Sparky mascot */}
            <motion.div
              className="relative shrink-0"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={ASSETS.HOME.LOGOS_FRAMEV2_NEUTRAL1}
                  alt=""
                  fill
                  aria-hidden
                  className="pointer-events-none object-contain"
                />
              </div>
              <Image
                src={ASSETS.HOME.WHO.SPARKY_CIRBY}
                alt="Sparky and Cirby, the GDG PUP mascots"
                width={612}
                height={606}
                className="pointer-events-none relative z-10"
              />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
              className="w-full"
            >
              <FrostedContentContainer>
                <Stack gap="lg" align="start" justify="center">
                  <Text
                    as="h3"
                    align="left"
                    gradient="blue"
                    variant="heading-5"
                    weight="bold"
                  >
                    We are More Than a Student Organization
                  </Text>

                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                  >

                    A Launchpad for Builders at PUP.
                  </Text>

                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="leading-8 text-base"
                  >
                    At Google Developer Groups on Campus – Polytechnic University of the Philippines, GDG PUP is a student-driven tech community built to bridge the gap between theory and real-world practice.
                  </Text>

                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                  >
                    We create spaces where students don’t just study technology — they build with it.
                  </Text>
                </Stack>
              </FrostedContentContainer>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="w-full"
          >
            <FrostedContentContainer
              ringClassName="rounded-tl-none"
              contentClassName="rounded-tl-none p-[70px]"
              ringGradient="linear-gradient(90deg, #83A0FF, #1DA0FE00, #1DA0FE00, #83A0FF)"
              contentBackgroundColor="transparent"
              contentBackdropFilter="none"
            >
              <Text align="center" variant="body" weight="bold" color="on-primary" className="leading-8">
                Whether you’re exploring Web development, Artificial Intelligence and Machine Learning (AI/ML), Cybersecurity, Cloud Solutions, UI/UX Design, Internet of Things (IoT), Project Management, or even as a core functional team member (Operations, Finance, Creatives, Marketing, Partnerships), our community provides opportunities to learn, collaborate, and grow alongside peers and mentors.
                <br />
                <br />
                From hands-on workshops and Study Jams to hackathons, industry collaborations, and real startup projects, GDG PUP empowers learners to transform classroom knowledge into practical skills that matter in today’s tech industry.
              </Text>
            </FrostedContentContainer>
          </motion.div>
        </Stack>
      </Container>
    </section>
  );
}
