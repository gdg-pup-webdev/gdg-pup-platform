"use client";

import Link from "next/link";
import { Container, Stack, Text, Button } from "@packages/spark-ui";
import { AboutTheTeam } from "./AboutTheTeam";
import { TeamHero } from "./team-section/TeamHero";
import { StudyJamsGrid } from "./team-section/StudyJamsGrid"; 
interface TeamSectionProps {
  teamName: string;
  teamSlug: string;
}
 

export function TeamSection({ teamName, teamSlug }: TeamSectionProps) {
 

  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-40 lg:pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Background layers */}
      <img
        src="/products/RL-SPACE_BG_3_3.png"
        alt=""
        className="absolute top-280 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/RL-SPACE_BG_3_2.png"
        alt=""
        className="absolute top-165 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/RL-SPACE_BG_3_1.png"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      {/* Decorative blobs */}
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
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#34A85333",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10 mt-30">
          {/* ── About the Team ── */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              ABOUT THE TEAM
            </Text>
            <Text
              variant="heading-1"
              gradient="white-yellow"
              align="center"
              weight="bold"
              className="mt-10"
            >
              {teamName}
            </Text>

            <TeamHero teamName={teamName} />

            <div className="w-full max-w-10xl mx-auto my-6 z-10 mt-30">
              <AboutTheTeam
                description={
                  <>
                    The{" "}
                    <span className="text-[#EA4335]">
                      Internet of Things (IoT) Team
                    </span>{" "}
                    dedicates the design, development, and implementation of
                    interconnected systems that bridge the digital and physical
                    worlds. Members of this team will engage in every stage of
                    IoT solution development, from conceptualizing device
                    integrations and designing smart system architectures to
                    coding, testing, and deploying functional prototypes.
                  </>
                }
                categories={
                  <>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      Embedded Systems
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      Sensor &amp; Device Integration
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      Network Communication
                    </span>
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
        </Stack>
      </Container>
    </div>
  );
}
