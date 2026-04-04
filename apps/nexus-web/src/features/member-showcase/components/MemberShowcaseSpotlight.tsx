"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Inline, Skeleton, Stack, Text } from "@packages/spark-ui";
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

function SpotlightSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 px-0 md:gap-10 md:px-6 lg:flex-row lg:gap-12 lg:px-24">
      {/* Image skeleton with Sparky overlaid */}
      <div className="relative w-full shrink-0 lg:w-120">
        <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "640/390" }} />
      </div>
      {/* Text skeleton */}
      <div className="flex-1 w-full">
        <Stack gap="md">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-10 w-32 mt-2" />
        </Stack>
      </div>
    </div>
  );
}

export function MemberShowcaseSpotlight() {
  const prefersReduced = useReducedMotion();

  const { data, isLoading, error} = useSpotlight();

  return (
    <motion.div
      variants={prefersReduced ? undefined : spotlightSectionVariants}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={SECTION_VIEWPORT}
    >
      <Stack 
      >
        <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
          <Text
            variant="heading-4"
            gradient="white-blue"
            weight="bold"
            align="center"
            className="text-xl font-bold w-auto pl-16"
          >
            Spotlight of the Day
          </Text>
        </motion.div>

        {isLoading ? (
          <SpotlightSkeleton />
        ) : (
          <motion.div
            className="flex flex-col items-center gap-8 px-0 md:gap-10 md:px-6 lg:flex-row lg:gap-12 lg:px-24"
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
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "640/390" }}>
                <Image
                  src={data ? data.data.thumbnailUrl : ASSETS.PLACEHOLDERS.DEFAULT}
                  alt="Spotlight featured image"
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
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
                  className="pointer-events-none absolute z-10 w-20 h-auto -top-18.25 left-10 md:w-34 md:-top-31 lg:-top-40 lg:left-35 lg:w-44 lg:h-auto"
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
                    {data ? data.data.title : ""}
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
                  {data ? data.data.createdAt : ""}
                </Text>
                <Text variant="body" color="on-primary">
                  {data ? data.data.description : ""}
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
        )}
      </Stack>
    </motion.div>
  );
}
