import Image from "next/image";
import { Container, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { AboutTheTeam } from "./AboutTheTeam";
import { TeamLeadsGrid } from "./team-structure-section/TeamLeadsGrid";
import { TeamStructureDropdowns } from "./team-structure-section/TeamStructureDropdowns";

interface TeamStructureSectionProps {
  teamName: string;
  teamSlug: string;
}

export function TeamStructureSection({ teamName, teamSlug }: TeamStructureSectionProps) {
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
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />
      <img
        className="w-165 h-auto absolute bottom-180 -right-10 opacity-25 translate-x-1/3 rotate-[-16deg] z-10"
        src="/products/cogwheel-asset.png"
        alt=""
      />
      <img
        className="w-500 h-auto absolute bottom-0 right-150 translate-x-1/3"
        src="/products/RL-gold-2.png"
        alt=""
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

      <Container maxWidth="full">
        <Stack gap="2xl" className="relative z-10">
          {/* ── About the Team ── */}
          <Stack gap="lg" className="items-center">
            <Text variant="heading-1" gradient="white-blue" align="center" weight="bold">
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

            {/* Team image + spirals */}
            <div className="w-full mt-20 flex flex-col items-center">
              <div className="w-full flex justify-center">
                <Image
                  src="/products/ui-ux-logo.png"
                  alt={`${teamName} team`}
                  width={900}
                  height={500}
                  className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] rounded-2xl object-cover relative z-20"
                />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[1200px] lg:w-[1900px] pointer-events-none z-10">
                <Image
                  src="/products/gold-4.png"
                  alt=""
                  width={1200}
                  height={600}
                  className="w-full h-auto mix-blend-screen opacity-67 blur-[50px]"
                />
              </div>
              <div className="relative w-full max-w-3xl h-[100px] md:h-[140px] mt-[-10px] pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-[300px] md:w-[450px] lg:w-570 aspect-[1204/188] opacity-70">
                  <Image src={ASSETS.ID.SPIRAL_OUTER} alt="" fill className="object-contain" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-30 w-[240px] md:w-[360px] lg:w-480 aspect-[1204/188] opacity-70">
                  <Image src={ASSETS.ID.SPIRAL_OUTER} alt="" fill className="object-contain" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[200px] md:w-[300px] lg:w-410 aspect-[1018/125] opacity-80">
                  <Image src={ASSETS.ID.SPIRAL_CENTER} alt="" fill className="object-contain" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-[220px] md:w-[330px] lg:w-450 aspect-[697/66] opacity-100">
                  <Image src={ASSETS.ID.SPIRAL_INNER} alt="" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* About the Team card */}
            <div className="w-full max-w-[1600px] mx-auto my-6 z-10 mt-30">
              <AboutTheTeam
                description={
                  <div className="text-lg md:text-3xl leading-snug md:leading-12 font-medium">
                    <>
                      The <span className="text-yellow-400">UI/UX Team</span>{" "}
                      focuses on creating intuitive and engaging user interfaces
                      and experiences for digital products. Members of this team
                      will work on designing user-centric interfaces, conducting
                      usability testing, and creating wireframes and prototypes.
                      Throughout the term, they will gain experience in design
                      tools and methodologies, ensuring that the software and
                      applications developed are not only functional but also
                      visually appealing and easy to use.
                    </>
                  </div>
                }
                categories={
                  <>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      UI Design
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      UX Research
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      Prototyping
                    </span>
                  </>
                }
              />
            </div>
          </Stack>

          {/* ── Current Team Leads ── */}
          <TeamLeadsGrid teamSlug={teamSlug} />

          {/* ── Team Structure + Dropdowns ── */}
          <TeamStructureDropdowns teamSlug={teamSlug} />
        </Stack>
      </Container>
    </div>
  );
}
