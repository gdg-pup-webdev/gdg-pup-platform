"use client";

import { Container, Stack, Text } from "@packages/spark-ui";

export function BelowHeroSection() {
  return (
    <section className="relative z-30 bg-background">
      {/* Gradient transition from hero */}
      <div className="pointer-events-none absolute -top-24 left-0 h-24 w-full bg-linear-to-b from-transparent to-background" />

      <Container className="py-20 md:py-28 text-center">
        <Stack gap="lg" align="center">
          <Text as="h2" variant="heading-2" gradient="yellow" align="center" weight="bold">
            TEST
          </Text>

        </Stack>
      </Container>

      {/* Scroll runway so the full parallax range is reachable */}
      <div className="h-[50vh]" />
    </section>
  );
}
