"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Inline, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { ITEM_VARIANTS } from "./memberShowcaseMotion";
import { useSpotlight } from "../hooks/useSpotlight";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { BrandedSkeleton } from "@/components/shared";

function SpotlightSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 px-0 md:gap-10 md:px-6 lg:flex-row lg:gap-12 lg:px-24">
      {/* Image skeleton with Sparky overlaid */}
      <div className="relative w-full shrink-0 lg:w-120">
        <BrandedSkeleton
          className="w-full rounded-2xl"
          style={{ aspectRatio: "640/390" }}
          withGradientRing
        />
      </div>
      {/* Text skeleton */}
      <div className="flex-1 w-full">
        <Stack gap="md">
          <BrandedSkeleton className="h-8 w-3/4" />
          <BrandedSkeleton className="h-4 w-1/3" variant="text" />
          <BrandedSkeleton className="h-4 w-full" variant="text" />
          <BrandedSkeleton className="h-4 w-5/6" variant="text" />
          <BrandedSkeleton className="h-4 w-4/6" variant="text" />
          <BrandedSkeleton
            className="h-10 w-32 mt-2"
            variant="button"
            withGradientRing
          />
        </Stack>
      </div>
    </div>
  );
}

export function MemberShowcaseSpotlight() {
  const prefersReduced = useReducedMotion();

  const { data, isLoading } = useSpotlight();
  const isSpotlightLoading = isLoading || !data?.data;

  return (
    <div>
      <Stack>
        <div className="flex justify-center w-full">
          <Text
            variant="heading-4"
            gradient="white-blue"
            weight="bold"
            align="center"
            className="text-2xl font-bold w-auto mb-0 md:ml-0 ml-7"
          >
            Spotlight of the Day
          </Text>
        </div>

        {isSpotlightLoading ? (
          <SpotlightSkeleton />
        ) : (
          <motion.div
            className="flex flex-col items-center lg:items-start gap-8 px-0 md:gap-6 md:px-6 lg:flex-row lg:gap-8 "
            initial={prefersReduced ? undefined : "hidden"}
            animate={prefersReduced ? undefined : "visible"}
          >
            <motion.div
              className="relative w-full shrink-0 lg:w-120"
              variants={prefersReduced ? undefined : ITEM_VARIANTS}
              // whileHover={prefersReduced ? undefined : { rotate: -2, y: -4 }}
              // transition={
              //   prefersReduced
              //     ? undefined
              //     : { type: "spring", stiffness: 220, damping: 18 }
              // }
            >
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{ aspectRatio: "640/390" }}
              >
                <Image
                  src={
                    data ? data.data.thumbnailUrl : ASSETS.PLACEHOLDERS.DEFAULT
                  }
                  alt="Spotlight featured image"
                  fill
                  className="object-cover pointer-events-none"
                />

                {/* Bottom Right Label: Avatars & Text */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md pl-1.5 pr-4 py-1.5 border border-white/10 select-none shadow-xl">
                  <div className="flex -space-x-2">
                    <img
                      src={ASSETS.MEMBER_SHOWCASE.ICONS.SPARKY_LEADERBOARD}
                      alt="Avatar"
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-[#1d2231] bg-[#1d2231] object-cover"
                    />
                  </div>
                  <span className="text-[9px] md:text-[11px] font-medium text-white shadow-sm">
                    We are proud of you!
                  </span>
                </div>
              </div>

              <motion.div
                className="absolute z-10 -top-7 md:-top-11 lg:-top-13 left-2 md:left-4 lg:left-6"
                style={{ transform: "translate(-30%, -40%)" }}
              >
                <Image
                  src={ASSETS.MEMBER_SHOWCASE.ICONS.SPARKY_LEADERBOARD}
                  alt="Sparky leaderboard"
                  width={178}
                  height={241}
                  className="pointer-events-none w-20 h-auto md:w-32 lg:w-40"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1"
              variants={prefersReduced ? undefined : ITEM_VARIANTS}
            >
              <Stack gap="sm" className="text-center lg:text-left">
                <Inline justify="between">
                  <Text
                    variant="heading-6"
                    gradient="white-yellow"
                    weight="bold"
                    className="capitalize"
                  >
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
                  {data && data.data.createdAt
                    ? formatDate(new Date(data.data.createdAt))
                    : ""}
                </Text>
                <Text variant="body" color="on-primary">
                  {data ? data.data.description : ""}
                </Text>
                <div className="justify-center hidden lg:flex lg:justify-start">
                  <Link
                    prefetch={false}
                    href={data ? data.data.articleUrl : "#"}
                  >
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
    </div>
  );
}
