"use client";

import { Button, Container, Stack, Text, Inline } from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";
import { FrostedContentContainer } from "./frosted-content-container";

export function SparkStartsHereSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bulletColors = ["#4285F4", "#F9AB00", "#34A853", "#EA4335"];

  return (
    <section
      className="relative hidden lg:block z-30 mt-26.25 pb-20.25"
      ref={ref}
    >
      <Container className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          <div className="relative">
            <Image
              src={ASSETS.HOME.SPARKY_LEADERBOARD1}
              alt=""
              aria-hidden
              width={430}
              height={420}
              draggable={false}
              className="pointer-events-none select-none absolute left-0 -top-87.5 z-20"
            />

            <FrostedContentContainer
              className="relative z-10"
              contentClassName="p-12.5"
            >
              <div className="flex items-start gap-11 w-full">
                {/* Left column: heading */}
                <Stack className="w-1/3 gap-11" align="start">
                  <Text
                    as="h2"
                    align="left"
                    color="on-primary"
                    variant="heading-2"
                    weight="bold"
                  >
                    Your Spark Starts Here.
                  </Text>
                  <Button asChild variant="colored" subVariant="blue" size="lg">
                    <Link prefetch={false} href="/signin">
                      Spark your Journey
                    </Link>
                  </Button>
                </Stack>

                {/* Right column: rest of content*/}
                <Stack align="start" className="w-[65%] gap-11">
                  <Text
                    as="h3"
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-2xl"
                  >
                    If you&apos;re a student at the Polytechnic University of
                    the Philippines looking to gain real-world tech experience,
                    expand your network, and grow beyond the classroom — GDG PUP
                    is your starting point.
                  </Text>

                  <Stack className="gap-3.5">
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
                        From theory to execution.
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
                        From classroom to community.
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
                        From student to builder.
                      </Text>
                    </Inline>
                  </Stack>

                  <Text
                    align="left"
                    variant="body"
                    weight="normal"
                    color="on-primary"
                    className="text-xl"
                  >
                    This is where your chapter begins.
                  </Text>
                </Stack>
              </div>
            </FrostedContentContainer>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
