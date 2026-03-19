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
                <Card className="w-full">
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
