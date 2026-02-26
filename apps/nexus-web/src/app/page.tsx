"use client";

import { Box, Button, Stack, Text } from "@packages/spark-ui";

export default function HomePage() {
  return (
    <Stack align="center" justify="center" className="h-screen">
      <Box className="relative z-10 text-center px-6 max-w-4xl">
        <Text
          variant="heading-1"
          align="center"
          gradient="white-blue"
          weight="bold"
          className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
        >
          Bridging the gap between theory and practice.
        </Text>
        <Text
          variant="body"
          align="center"
          weight="bold"
          className="text-white/90 max-w-3xl mx-auto leading-relaxed"
        >
          GDG PUP helps student developers grow through real projects, events,
          and mentorship connecting classroom learning to industry practice.
        </Text>
        {/* Insert an Icon here */}
        <Button variant="default" size="lg" className="mt-8">
          Spark your Journey
        </Button>
      </Box>
    </Stack>
  );
}
