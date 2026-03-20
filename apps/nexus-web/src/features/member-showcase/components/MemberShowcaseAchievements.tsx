"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Card, CardFooter, CardHeader, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import {
  createContainerVariants,
  createSectionVariants,
  ITEM_VARIANTS,
  SECTION_DELAYS,
  SECTION_VIEWPORT,
} from "./memberShowcaseMotion";

const MEMBER_ACHIEVEMENT_CARDS = [
  { src: ASSETS.MEMBER_SHOWCASE.ACHIEVEMENTS.CICADA, alt: "Cicada", title: "Lorem Ipsum" },
  { src: ASSETS.MEMBER_SHOWCASE.ACHIEVEMENTS.OMAGAD, alt: "Omagad", title: "Lorem Ipsum" },
  { src: ASSETS.MEMBER_SHOWCASE.ACHIEVEMENTS.SPARKPLUG, alt: "Sparkplug", title: "Lorem Ipsum" },
];

const achievementsSectionVariants = createSectionVariants(SECTION_DELAYS.achievements);
const achievementsListVariants = createContainerVariants(0.18, 0.14);

export function MemberShowcaseAchievements() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? undefined : achievementsSectionVariants}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={SECTION_VIEWPORT}
    >
      <Stack gap="xl" className="mt-16">
        <Stack className="gap-1">
          <Text variant="heading-4" gradient="white-blue" align="center" weight="bold">
            Member Achievements
          </Text>
          <Text variant="heading-6" color="on-primary" align="center">
            Lorem Ipsum
          </Text>
        </Stack>

        <motion.div
          className="flex items-center gap-2 md:gap-3 lg:gap-4"
          variants={prefersReduced ? undefined : achievementsListVariants}
        >
          <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
            <Button
              className="rounded-full px-0 w-9 h-9 min-w-0 md:w-10 md:h-10 lg:w-12 lg:h-12"
              size="lg"
              subVariant="blue"
              variant="colored"
            >
              ←
            </Button>
          </motion.div>

          <motion.div
            className="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
            variants={prefersReduced ? undefined : achievementsListVariants}
          >
            {MEMBER_ACHIEVEMENT_CARDS.map((card, index) => (
              <motion.div
                key={`${card.alt}-${index}`}
                className={index > 0 ? "hidden md:block" : "block"}
                variants={prefersReduced ? undefined : ITEM_VARIANTS}
              >
                <Card className="relative w-full overflow-hidden bg-[#1d2231]/85 shadow-[0_7px_18px_rgba(0,0,0,0.25)] backdrop-blur-md">
                  <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(69,88,132,0.55)_0%,rgba(31,40,66,0.86)_38%,rgba(15,27,59,0.98)_100%)]" />
                    <div className="absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-80 blur-xl bg-[radial-gradient(130%_90%_at_50%_120%,rgba(92,132,255,0.84)_0%,rgba(68,205,255,0.4)_30%,rgba(68,205,255,0)_62%)]" />
                    <div className="absolute right-0 bottom-5 left-0 h-24 bg-[radial-gradient(84%_185%_at_50%_100%,rgba(140,166,255,0.78)_0%,rgba(140,166,255,0.3)_48%,rgba(140,166,255,0)_78%)] blur-2xl" />
                    <div className="absolute right-2 bottom-5 left-2 h-16 bg-[radial-gradient(95%_180%_at_50%_100%,rgba(79,255,173,0.62)_0%,rgba(79,255,173,0)_80%)] blur-xl" />
                    <div className="absolute -top-12 -left-24 h-24 w-[170%] rotate-30 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.62)_50%,rgba(255,255,255,0)_100%)] opacity-50 blur-[6px] mix-blend-overlay" />
                  </div>

                  <div className="relative z-10">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      width={2048}
                      height={2048}
                      className="h-44 w-full rounded-lg border border-white object-cover md:h-48 lg:h-52"
                    />
                    <CardHeader className="mt-3 text-lg font-bold md:mt-3.5 md:text-xl">
                      {card.title}
                    </CardHeader>
                    <CardFooter className="mt-4 flex justify-end md:mt-5">
                      <Button className="w-fit" size="lg" subVariant="blue" variant="colored">
                        <Image src={ASSETS.MEMBER_SHOWCASE.ICONS.LINK} alt="Link" width={27} height={27} />
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
            <Button
              className="rounded-full px-0 w-9 h-9 min-w-0 md:w-10 md:h-10 lg:w-12 lg:h-12"
              size="lg"
              subVariant="blue"
              variant="colored"
            >
              →
            </Button>
          </motion.div>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
