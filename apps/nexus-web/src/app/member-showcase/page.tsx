"use client";

import { Container, Stack } from "@packages/spark-ui";
import {
  MemberShowcaseAchievements,
  MemberShowcaseBackground,
  MemberShowcaseHero,
  MemberShowcaseSpotlight,
  MemberShowcaseSubmitStory,
} from "@/features/member-showcase";

export default function MemberShowcasePage() {
  return (
    <MemberShowcaseBackground>
      <Container>
        <Stack
          gap="2xl"
          className="relative z-10 flex flex-col gap-10 md:gap-12 lg:gap-8"
        >
          <MemberShowcaseHero />
          <MemberShowcaseSpotlight />
          <MemberShowcaseAchievements />
          <MemberShowcaseSubmitStory />
        </Stack>
      </Container>
    </MemberShowcaseBackground>
  );
}
