"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";

export function WhoAreWeSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="relative z-30 lg:pb-[136px]" ref={sectionRef}>
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
            >
              Who are we
            </Text>
          </motion.div>

          {/* Two-column layout: Sparky image + text */}
          <div className="flex items-center justify-center gap-4 w-full">
            {/* Sparky mascot */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            >
              <Image
                src={ASSETS.HOME.WHO.SPARKY_CIRBY}
                alt="Sparky and Cirby, the GDG PUP mascots"
                width={612}
                height={606}
              />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            >
              <Stack gap="xl" align="start" justify="center">
                <Text
                  as="h3"
                  align="left"
                  gradient="blue"
                  variant="heading-6"
                  weight="bold"
                >
                  A Launchpad for Builders at PUP.
                </Text>

                <Text
                  align="left"
                  variant="body"
                  weight="normal"
                  color="on-primary"
                  className="text-xl"
                >
                  At Google Developer Groups on Campus – Polytechnic University of the Philippines, GDG PUP is a student-driven tech community built to bridge the gap between theory and real-world practice.
                </Text>

                <Text
                  align="left"
                  variant="body"
                  weight="normal"
                  color="on-primary"
                  className="text-xl"
                >
                  We create spaces where students don't just study technology —
                  they build with it.
                </Text>

                <Text
                  align="left"
                  variant="body"
                  weight="normal"
                  color="on-primary"
                  className="text-xl"
                >
                  From hands-on workshops and Study Jams to hackathons, industry collaborations, and real startup projects, GDG PUP empowers learners to transform classroom knowledge into practical skills that matter in today's tech industry.
                </Text>
                <Text
                  align="left"
                  variant="body"
                  weight="normal"
                  color="on-primary"
                  className="text-xl"
                >
                  Whether you're exploring Web development, Artificial Intelligence and Machine Learning (AI/ML), Cybersecurity, Cloud Solutions, UI/UX Design, Internet of Things (IoT), Project Management, or even as a core functional team member (Operations, Finance, Creatives, Marketing, Partnerships), our community provides opportunities to learn, collaborate, and grow alongside peers and mentors.
                </Text>
              </Stack>
            </motion.div>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
