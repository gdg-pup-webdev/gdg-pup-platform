"use client";

import { Container, Stack, Text, Inline } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";
import { FrostedContentContainer } from "./frosted-content-container";

export function WhatDrivesUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bulletColors = ["#4285F4", "#F9AB00", "#34A853", "#EA4335"];

  return (
    <section className="relative z-30" ref={ref}>
      <Container className="py-10 lg:py-24">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          <Image
            src={ASSETS.HOME.SPARKY_THINKING1}
            alt=""
            aria-hidden
            width={473}
            height={630}
            draggable={false}
            className="pointer-events-none select-none absolute top-20 right-2 w-24 h-auto z-20 lg:w-[473px] lg:h-[630px] lg:left-0 lg:top-1/2 lg:-translate-y-1/2"
          />

          {/* Content on right */}
          <Stack
            gap="xl"
            align="start"
            className="w-full lg:w-[60%] ml-auto pt-6 lg:pt-0"
          >
            <Text
              as="h2"
              align="left"
              weight="bold"
              variant="heading-2"
              className="mb-0.5 text-left lg:text-left w-full text-white"
              style={{
                textShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.95), 0 8px 24px rgba(0, 0, 0, 0.95), 0 16px 48px rgba(0, 0, 0, 0.85)",
              }}
            >
              What drives us
            </Text>
            <FrostedContentContainer contentClassName="p-[30px]">
              <Stack gap="lg" align="start">
                <Text
                  as="h5"
                  align="left"
                  variant="heading-5"
                  weight="bold"
                  className="text-2xl text-white"
                >
                  We believe that:
                </Text>

                <Inline>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: bulletColors[0] }}
                  />
                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-xl"
                  >
                    Learning is stronger in community.
                  </Text>
                </Inline>

                <Inline>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: bulletColors[1] }}
                  />
                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-xl"
                  >
                    Growth happens through action.
                  </Text>
                </Inline>

                <Inline>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: bulletColors[2] }}
                  />
                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-xl"
                  >
                    Technology should create meaningful impact.
                  </Text>
                </Inline>

                <Inline>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: bulletColors[3] }}
                  />
                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-xl"
                  >
                    Curiosity matters more than credentials.
                  </Text>
                </Inline>
              </Stack>
            </FrostedContentContainer>
            <Text
              align="left"
              variant="body"
              weight="normal"
              color="on-primary"
              className="text-xl text-center lg:text-left pb-10 lg:pb-0"
            >
              GDG PUP is inclusive and open to all students — beginners,
              advanced developers, tech majors, and non-tech majors alike.
              <br />
              <br />
              No gatekeeping. No elitism. Just shared ambition and continuous
              learning.
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </section>
  );
}
