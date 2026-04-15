"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { FrostedContentContainer } from "./frosted-content-container";

export function WhatWeDoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bulletItems = [
    "Technical workshops powered by Google-backed tools and technologies",
    "Study Jams and skill-shares focused on hands-on learning",
    "Hackathons and real-world project collaborations",
    "Industry partnerships and opportunities",
    "Leadership and community-building events",
  ];

  return (
    <section className="relative z-30" ref={ref}>
      <Container className="py-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          {/* Content on left*/}
          <Stack gap="xl" align="start" className="w-full lg:w-[60%]">
            <Text
              as="h2"
              align="left"
              gradient="white-green"
              variant="heading-2"
              weight="bold"
              className="mb-0.5"
            >
              What we do
            </Text>
            <div className="relative w-full">
              <FrostedContentContainer>
                <div className="flex flex-col gap-7.5">
                  <div className="flex flex-col gap-2.5">
                    <Text
                      as="h3"
                      align="left"
                      gradient="white-yellow"
                      weight="bold"
                      color="on-primary"
                      className="text-2xl"
                    >
                      We design experiences that turn {" "}
                      <br className="hidden lg:inline" />
                      curiosity into capability:
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    {bulletItems.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 relative z-10"
                      >
                        <Image
                          src={ASSETS.HOME.BULLET_DIAMOND}
                          alt=""
                          aria-hidden
                          width={18}
                          height={18}
                          draggable={false}
                          className="pointer-events-none select-none mt-1 shrink-0"
                        />
                        <Text
                          align="left"
                          variant="body"
                          weight="normal"
                          color="on-primary"
                          className="text-lg"
                        >
                          {item}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </FrostedContentContainer>

              <Image
                src={ASSETS.HOME.CIRBY_STICKER21}
                alt=""
                aria-hidden
                width={486}
                height={536}
                draggable={false}
                className="pointer-events-none select-none absolute -top-15 right-5 w-24 h-auto lg:w-[486px] lg:h-[536px] lg:-right-100 lg:top-1/2 lg:-translate-y-1/2 z-20"
              />
            </div>
            <Text
              align="center"
              variant="body"
              weight="normal"
              color="on-primary"
              className="text-lg mx-auto lg:mx-0"
            >
              Every step is built around one principle: learning by doing.
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </section>
  );
}
