"use client";

import { motion, useReducedMotion } from "motion/react";
import { Input, Stack, Text } from "@packages/spark-ui";
import {
  createContainerVariants,
  ITEM_VARIANTS,
  SECTION_DELAYS,
} from "./memberShowcaseMotion";

const heroContainerVariants = createContainerVariants(0.12, 0.16);

export function MemberShowcaseHero() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? undefined : heroContainerVariants}
      initial={prefersReduced ? undefined : "hidden"}
      animate={prefersReduced ? undefined : "visible"}
      transition={prefersReduced ? undefined : { delay: SECTION_DELAYS.hero }}
    >
      <Stack gap="lg" className="items-center px-1 pb-8 md:px-8 md:pb-12 lg:px-72 lg:pb-16">
        <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
          <Text
            as="h1"
            variant="heading-1"
            gradient="white-yellow"
            align="center"
            weight="bold"
            className="text-5xl md:text-6xl lg:text-7xl"
          >
            Member Showcase
          </Text>
        </motion.div>

        <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
          <Text
            as="p"
            variant="body-lg"
            align="center"
            color="on-primary"
            weight="bold"
            className="text-base md:text-lg lg:max-w-none"
          >
            Be inspired by the stories built by our community.
          </Text>
        </motion.div>

        <motion.div
          className="w-full"
          variants={prefersReduced ? undefined : ITEM_VARIANTS}
        >
          <Input
            inputSize="lg"
            placeholder="Looking for Something?"
            type="search"
            variant="default"
          />
        </motion.div>
      </Stack>
    </motion.div>
  );
}
