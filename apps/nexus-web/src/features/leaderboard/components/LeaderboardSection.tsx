import Image from "next/image";
import { Container, Stack, Text } from "@packages/spark-ui";

export function LeaderboardSection() {
  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Decorative blob \u2014 top left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(900px, 65vw)",
          height: "min(800px, 70vh)",
          top: "calc(4rem - 300px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      {/* Decorative blob \u2014 right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#57CAFF33",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="xl" className="relative z-10 items-center">
          <Text
            variant="heading-1"
            gradient="blue"
            align="center"
            weight="bold"
          >
            LEADERBOARD
          </Text>

          <Text variant="heading-2" weight="bold" align="center">
            See who&apos;s leading the community
          </Text>

          <Text
            variant="body"
            align="center"
            color="secondary"
          >
            Track participation, celebrate impact, and recognize the members who
            help move GDG PUP forward. Our leaderboards highlight active
            contributors across events, projects, and community initiatives.
          </Text>

          <div className="mt-8">
            <Image
              src="/placeholder.svg"
              alt="GDG Sparky mascot"
              width={400}
              height={450}
              className="object-contain"
            />
          </div>
        </Stack>
      </Container>
    </div>
  );
}
