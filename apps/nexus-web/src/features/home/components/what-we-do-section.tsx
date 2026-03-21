"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
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
      <Container className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          {/* Content on left*/}
          <Stack gap="2xl" align="start" className="w-[60%]">
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
                      We design experiences that turn <br/>curiosity into capability:
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    {bulletItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <Image
                          src="/home/home-bullet-diamond.svg"
                          alt=""
                          aria-hidden
                          width={18}
                          height={18}
                          className="pointer-events-none mt-1 shrink-0"
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
                src="/CIRBY%20STICKER%202%201.png"
                alt=""
                aria-hidden
                width={486}
                height={536}
                className="pointer-events-none absolute -right-100 top-1/2 -translate-y-1/2 z-20"
              />
            </div>
          </Stack>
        </motion.div>
      </Container>
    </section>
  );
}
