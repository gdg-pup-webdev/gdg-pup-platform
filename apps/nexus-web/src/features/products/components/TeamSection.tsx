"use client";

import Link from "next/link";
import { Container, Stack, Text, Button } from "@packages/spark-ui";
import { AboutTheTeam } from "./AboutTheTeam";
import { Breadcrumbs } from "./Breadcrumbs";
import { TeamHero } from "./team-section/TeamHero";
import { StudyJamsGrid } from "./team-section/StudyJamsGrid";
import { LearningResourcesGrid } from "./team-section/LearningResourcesGrid";
import { TEAM_CONTENT } from "../data/team-content";

interface TeamSectionProps {
  teamName: string;
  teamSlug: string;
}

export function TeamSection({ teamName, teamSlug }: TeamSectionProps) {
  const content = TEAM_CONTENT[teamSlug];

  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-28 md:pt-36 lg:pt-44 pb-48 px-4 md:px-8 lg:px-16">
      {/* Background layers */}
      <img
        src="/products/rl-space-bg-3-3.webp"
        alt=""
        className="absolute top-280 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/rl-space-bg-3-2.webp"
        alt=""
        className="absolute top-165 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/rl-space-bg-3-1.webp"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      {/* Decorative blobs — use radial-gradient instead of filter:blur for GPU efficiency */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1100px, 80vw)",
          height: "min(1000px, 85vh)",
          top: "calc(4rem - 400px)",
          left: "max(calc((100vw - 80rem) / 2 - 100px), -100px)",
          background: "radial-gradient(ellipse at center, #4285F440 0%, #4285F420 40%, transparent 70%)",
          transform: "translateZ(0)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1000px, 75vw)",
          height: "min(1100px, 90vh)",
          top: "calc(4rem + 200px)",
          right: "max(calc((100vw - 80rem) / 2 - 400px), -200px)",
          background: "radial-gradient(ellipse at center, #34A85340 0%, #34A85320 40%, transparent 70%)",
          transform: "translateZ(0)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* ── Breadcrumbs ── */}
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: teamName },
            ]}
          />

          {/* ── About the Team ── */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
              className="text-3xl sm:text-4xl md:text-5xl"
            >
              ABOUT THE TEAM
            </Text>
            <Text
              variant="heading-1"
              gradient="white-yellow"
              align="center"
              weight="bold"
              className="mt-6 text-4xl sm:text-5xl md:text-6xl"
            >
              {teamName}
            </Text>

            <TeamHero teamName={teamName} teamSlug={teamSlug} />

            <div className="w-full max-w-7xl mx-auto my-6 z-10 mt-30">
              <AboutTheTeam
                description={
                  <div className="w-full text-justify font-['Google_Sans',sans-serif] text-lg font-normal leading-8 text-neutral-50 md:text-2xl md:leading-9">
                    {content ? (
                      <>
                        The{" "}
                        <span className={`${content.nameColor} font-medium`}>
                          {content.displayName ?? `${teamName} Team`}
                        </span>{" "}
                        {content.description.replace(/^The .+? Team /, "")}
                        {content.descriptionBullets && (
                          <ul className="mt-4 list-disc list-inside space-y-1">
                            {content.descriptionBullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <>No description available for this team.</>
                    )}
                  </div>
                }
                categories={
                  <>
                    {(content?.categories ?? []).map((cat) => (
                      <div
                        key={cat}
                        className="inline-flex h-8 items-center justify-start gap-1.5 rounded-3xl border border-white/10 bg-blue-950/30 px-3 py-1.5 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 md:h-10 md:px-4 md:py-2 lg:h-11 lg:gap-2.5 lg:px-5 lg:py-2.5"
                      >
                        <div className="whitespace-nowrap font-['Google_Sans',sans-serif] text-xs leading-4 font-normal text-white sm:text-sm sm:leading-5 md:text-base md:leading-6 lg:text-xl lg:leading-8">
                          {cat}
                        </div>
                      </div>
                    ))}
                  </>
                }
              />
            </div>

            <Link href={`/products/${teamSlug}/team-structure`}>
              <Button size="lg">See team leads and structure</Button>
            </Link>
          </Stack>

          {/* ── Study Jams ── */}
          <StudyJamsGrid teamSlug={teamSlug} />

          {/* ── Learning Resources ── */}
          <LearningResourcesGrid teamSlug={teamSlug} />
        </Stack>
      </Container>
    </div>
  );
}
