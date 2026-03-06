"use client";

import { motion } from "motion/react";
import { Container, Stack, Text } from "@packages/spark-ui";
import { IdBlobs } from "./IdBlobs";
import { IdHeroStage } from "./IdHeroStage";
import { IdHowItWorks } from "./IdHowItWorks";

export function IdSection() {
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-24 md:pt-44 lg:pt-60 pb-48 px-4 md:px-8 lg:px-16">

      <IdBlobs />

      <Container>
        <Stack gap="2xl" className="relative z-10">

          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <Text variant="heading-1" gradient="white-blue" align="center" weight="bold">
              GDG ID PLATFORM
            </Text>
            <Text as="p" variant="heading-6" align="center" color="secondary" weight="normal" className="text-white mt-3 mx-auto">
              Built for the future of GDG PUP, the GDG ID Platform brings
              members together through a seamless, connected, and empowered
              digital experience.
            </Text>
          </motion.div>

          <IdHeroStage />

          <IdHowItWorks />

        </Stack>
      </Container>
    </div>
  );
}
