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
  const rainbowGradientTextClass =
    "bg-[linear-gradient(90deg,#EA4335_0%,#F9AB00_33%,#34A853_66%,#4285F4_100%)] bg-clip-text text-transparent font-bold";

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
              className="relative shrink-0 w-45 lg:w-153"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            >
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src={ASSETS.HOME.LOGOS_FRAMEV2_NEUTRAL1}
                  alt=""
                  width={431}
                  height={431}
                  aria-hidden
                  draggable={false}
                  className="pointer-events-none select-none object-contain"
                />
              </div>
              <Image
                src={ASSETS.HOME.WHO.SPARKY_CIRBY}
                alt="Sparky and Cirby, the GDG PUP mascots"
                width={494}
                height={530}
                priority
                draggable={false}
                className="pointer-events-none select-none relative z-10 w-full h-auto object-contain"
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
                    At Google Developer Groups on Campus – Polytechnic
                    University of the Philippines, GDG PUP is a student-driven
                    tech community built to bridge the gap between theory and
                    real-world practice.
                  </Text>

                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                  >
                    We create spaces where students don’t just study technology
                    — they build with it.
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
              contentClassName="rounded-tl-none"
              ringGradient="linear-gradient(90deg, #83A0FF, #1DA0FE00, #1DA0FE00, #83A0FF)"
              contentBackgroundColor="transparent"
              contentBackdropFilter="none"
            >
              <Text
                align="center"
                variant="body"
                weight="normal"
                color="on-primary"
                className="leading-8 text-lg py-16.75 px-6.75"
              >
                Whether you’re exploring{" "}
                <span className={rainbowGradientTextClass}>Web Development</span>,{" "}
                <span className={rainbowGradientTextClass}>Data</span>{" "}
                and{" "}
                <span className={rainbowGradientTextClass}>Machine Learning</span>{" "}
                (Data and ML), {" "}
                <span className={rainbowGradientTextClass}>Cybersecurity</span>,{" "}
                <span className={rainbowGradientTextClass}>Cloud Solutions</span>,{" "}
                <span className={rainbowGradientTextClass}>UI/UX Design</span>,{" "}
                <span className={rainbowGradientTextClass}>
                  Internet of Things
                </span>{" "}
                (IoT),{" "}
                <span className={rainbowGradientTextClass}>Project Management</span>,
                or even as a core functional team member (
                <span className={rainbowGradientTextClass}>Operations</span>,{" "}
                <span className={rainbowGradientTextClass}>Finance</span>,{" "}
                <span className={rainbowGradientTextClass}>Secretariat</span>,{" "}
                <span className={rainbowGradientTextClass}>Creatives</span>,{" "}
                <span className={rainbowGradientTextClass}>Marketing</span>,{" "}
                <span className={rainbowGradientTextClass}>Partnerships</span>,{" "}
                <span className={rainbowGradientTextClass}>Community Relations</span>),
                our community provides opportunities to learn, collaborate, and grow
                alongside peers and mentors.
                <br />
                <br />
                From hands-on workshops and Study Jams to hackathons, industry
                collaborations, and real startup projects, GDG PUP empowers
                learners to transform classroom knowledge into practical skills
                that matter in today’s tech industry.
              </Text>
            </FrostedContentContainer>
          </motion.div>
        </Stack>
      </Container>
    </section>
  );
}
