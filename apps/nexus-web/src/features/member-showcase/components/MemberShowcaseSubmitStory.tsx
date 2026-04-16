"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import {
  createContainerVariants,
  createSectionVariants,
  ITEM_VARIANTS,
  SECTION_DELAYS,
  SECTION_VIEWPORT,
} from "./memberShowcaseMotion";

const submitStorySectionVariants = createSectionVariants(SECTION_DELAYS.submitStory);
const submitStoryContainerVariants = createContainerVariants(0.2, 0.18);

export function MemberShowcaseSubmitStory() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? undefined : submitStorySectionVariants}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={SECTION_VIEWPORT}
    >
      <Stack gap="lg" className="mt-16">
        <motion.div
          className="px-0 md:px-6 lg:px-24"
          variants={prefersReduced ? undefined : submitStoryContainerVariants}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
              <Stack
                gap="xl"
                align="center"
                justify="center"
                width="auto"
                className="text-center lg:items-start lg:text-left"
              >
                <Stack gap="xs">
                  <Text variant="heading-4" className="text-center lg:text-start" gradient="white-yellow" weight="bold">
                    Want to Be Featured?
                  </Text>
                  <Text className="text-xl text-center lg:text-start" color="on-primary">
                    Have a project, achievement, or tech journey you&apos;re proud
                    of? We&apos;d love to feature your story in our Member
                    Showcase. Whether it&apos;s a competition entry, research,
                    personal build, or collaborative project, your experience can
                    inspire the community.
                  </Text>
                </Stack>
                <Button asChild variant="colored" subVariant="blue" size="lg">
                  <a href="https://forms.gle/wNpWYMT6hGPidtEL8">Submit your story</a>
                </Button>
              </Stack>
            </motion.div>

            <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
              <Stack className="items-center lg:items-end">
                <Image
                  src={ASSETS.MEMBER_SHOWCASE.SUBMIT_STORY.SPARKY_CIRBY}
                  width={3023}
                  height={4096}
                  alt="sparky and cirby"
                  className="h-auto w-full max-w-60 hidden lg:block md:max-w-80 lg:max-w-96"
                />
              </Stack>
            </motion.div>
          </div>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
