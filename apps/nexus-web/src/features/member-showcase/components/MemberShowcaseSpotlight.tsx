"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Inline, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import {
  createContainerVariants,
  createSectionVariants,
  ITEM_VARIANTS,
  SECTION_DELAYS,
  SECTION_VIEWPORT,
} from "./memberShowcaseMotion";
import { useSpotlight } from "../hooks/useSpotlight";
import Link from "next/link";

const spotlightSectionVariants = createSectionVariants(
  SECTION_DELAYS.spotlight,
);
const spotlightContainerVariants = createContainerVariants(0.16, 0.16);

export function MemberShowcaseSpotlight() {
  const prefersReduced = useReducedMotion();

  const { data, error, isLoading } = useSpotlight();

  return (
    <motion.div
      variants={prefersReduced ? undefined : spotlightSectionVariants}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={SECTION_VIEWPORT}
    >
      <Stack>
        <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
          <Text
            variant="heading-4"
            gradient="white-blue"
            weight="bold"
            align="center"
          >
            Spotlight of the Day
          </Text>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-8 px-0 md:mt-10 md:gap-10 md:px-6 lg:mt-12 lg:flex-row lg:gap-12 lg:px-24"
          variants={prefersReduced ? undefined : spotlightContainerVariants}
        >
          <motion.div
            className="relative w-full shrink-0 lg:w-120"
            variants={prefersReduced ? undefined : ITEM_VARIANTS}
            whileHover={prefersReduced ? undefined : { rotate: -2, y: -4 }}
            transition={
              prefersReduced
                ? undefined
                : { type: "spring", stiffness: 220, damping: 18 }
            }
          >
            <Image
              src={data ? data.data.thumbnailUrl : ASSETS.PLACEHOLDERS.DEFAULT}
              alt="Spotlight featured image"
              width={480}
              height={340}
              className="w-full rounded-2xl object-cover pointer-events-none"
            />
            <motion.div
              whileHover={prefersReduced ? undefined : { rotate: 4, y: -6 }}
              transition={
                prefersReduced
                  ? undefined
                  : { type: "spring", stiffness: 240, damping: 18 }
              }
            >
              <Image
                src={ASSETS.MEMBER_SHOWCASE.ICONS.SPARKY_LEADERBOARD}
                alt="Sparky leaderboard"
                width={178}
                height={241}
                className="pointer-events-none absolute -top-16 right-[75%] z-10 w-20 md:-top-24 md:right-[30%] md:w-24 lg:top-[-52%] lg:w-auto"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1"
            variants={prefersReduced ? undefined : ITEM_VARIANTS}
          >
            <Stack gap="md" className="text-center lg:text-left">
              <Inline justify="between">
                <Text variant="heading-6" gradient="white-yellow" weight="bold">
                  {data ? data.data.title : "Loading..."}
                </Text>
                <Button
                  className="w-fit lg:hidden"
                  size="md"
                  subVariant="blue"
                  variant="colored"
                >
                  <Image
                    src={ASSETS.MEMBER_SHOWCASE.ICONS.LINK}
                    alt="Link"
                    width={27}
                    height={27}
                  />
                </Button>
              </Inline>
              <Text variant="body" color="secondary">
                {data ? data.data.createdAt : "Loading description..."}
              </Text>
              <Text variant="body" color="on-primary">
                {data ? data.data.description : "Loading description..."}
              </Text>
              <div className="justify-center hidden lg:flex lg:justify-start">
                <Link href={data ? data.data.articleUrl : "#"}>
                  <Button variant="colored" subVariant="blue" size="lg">
                    Learn more
                  </Button>
                </Link>
              </div>
            </Stack>
          </motion.div>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
