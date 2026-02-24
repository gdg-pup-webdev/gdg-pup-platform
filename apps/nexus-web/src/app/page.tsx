"use client";

import { Box, Button, Stack } from "@packages/spark-ui";


export default function HomePage() {
  return (
    <Stack align="center" justify="center" className="h-screen">
      <Box className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Bridging the gap between theory and practice.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          GDG PUP helps student developers grow through real projects, events,
          and mentorship connecting classroom learning to industry practice.
        </p>
        {/* Insert an Icon here */}
        <Button variant="default" size="lg" className="mt-8">
          Spark your Journey
        </Button>
      </Box>
    </Stack>
  );
}
