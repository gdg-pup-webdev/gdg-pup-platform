import Image from "next/image";
import { Container, Stack, Text } from "@packages/spark-ui";
import type { TextVariants } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { AboutTheTeam } from "./AboutTheTeam";
import { Breadcrumbs } from "./Breadcrumbs";
import { TeamLeadsGrid } from "./team-structure-section/TeamLeadsGrid";
import { TeamStructureDropdowns } from "./team-structure-section/TeamStructureDropdowns";
import { TEAM_CONTENT } from "../data/team-content";

interface TeamStructureSectionProps {
  teamName: string;
  teamSlug: string;
}

type TeamTitleGradient = NonNullable<TextVariants["gradient"]>;

const TEAM_IMAGES: Record<string, string> = {
  iot: "/products/iot-logo.webp",
  "ui-ux": "/products/ui-ux-logo.webp",
  "web-development": "/products/web-development-logo.webp",
  "data-ml": "/products/data-ml-logo.webp",
  cybersecurity: "/products/cybersecurity-logo.webp",
  "cloud-solutions": "/products/cloud-solutions-logo.webp",
  "project-management": "/products/project-management-logo.webp",
  community: "/products/community-logo.webp",
};

const TEAM_GLOW_COLORS: Record<string, string> = {
  "ui-ux": "#F9AB00",
  "web-development": "#4285F4",
  iot: "#EA4335",
  cybersecurity: "#34A853",
  "data-ml": "#4285F4",
  "cloud-solutions": "#EA4335",
  "project-management": "#34A853",
  community: "#F9AB00",
};

type GlowSize = {
  base: string;
  md: string;
  lg: string;
};

const TEAM_GLOW_SIZES: Record<string, GlowSize> = {};

const TEAM_TITLE_GRADIENTS: Record<string, TeamTitleGradient> = {
  "ui-ux": "white-yellow",
  "web-development": "white-blue",
  iot: "white-red",
  cybersecurity: "white-green",
  "data-ml": "white-blue",
  "cloud-solutions": "white-red",
  "project-management": "white-green",
  community: "white-yellow",
};

export function TeamStructureSection({
  teamName,
  teamSlug,
}: TeamStructureSectionProps) {
  const content = TEAM_CONTENT[teamSlug];
  const imageSrc = TEAM_IMAGES[teamSlug] ?? "/products/ui-ux-logo.webp";
  const glowColor = TEAM_GLOW_COLORS[teamSlug] ?? "#F9AB00";
  const glowSize = TEAM_GLOW_SIZES[teamSlug] ?? {
    base: "350px",
    md: "500px",
    lg: "550px",
  };
  const titleGradient = TEAM_TITLE_GRADIENTS[teamSlug] ?? "white-yellow";
  const hideSupportGroup = teamSlug === "project-management";

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
      <img
        className="w-165 h-auto absolute bottom-180 -right-10 opacity-25 translate-x-1/3 rotate-[-16deg] z-10"
        src="/products/cogwheel-asset.webp"
        alt=""
      />
      <img
        className="w-auto h-auto absolute bottom-0 right-0"
        src="/products/RL-gold-2.webp"
        alt=""
      />

      {/* Decorative blobs — use radial-gradient instead of filter:blur for GPU efficiency */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1100px, 80vw)",
          height: "min(1000px, 85vh)",
          top: "calc(4rem - 400px)",
          left: "max(calc((100vw - 80rem) / 2 - 100px), -100px)",
          background:
            "radial-gradient(ellipse at center, #4285F440 0%, #4285F420 40%, transparent 70%)",
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
          background:
            "radial-gradient(ellipse at center, #34A85340 0%, #34A85320 40%, transparent 70%)",
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
              { label: teamName, href: `/products/${teamSlug}` },
              { label: "Team Structure" },
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

            {/* Team image + spirals */}
            <div className="relative w-full mt-20 flex flex-col items-center">
              <div className="relative w-full flex justify-center items-center overflow-visible">
                <div
                  className="
        absolute left-1/2 top-1/2 rounded-full pointer-events-none z-[1]
        w-[var(--glow-size)] h-[var(--glow-size)]
        md:w-[var(--glow-size-md)] md:h-[var(--glow-size-md)]
        lg:w-[var(--glow-size-lg)] lg:h-[var(--glow-size-lg)]
      "
                  style={{
                    background: `
          radial-gradient(
            ellipse 75% 65% at 50% 48%,
            ${glowColor}66 0%,
            ${glowColor}38 30%,
            ${glowColor}18 58%,
            transparent 82%
          ),
          radial-gradient(
            ellipse 50% 40% at 28% 70%,
            #ff3b3055 0%,
            #ff3b3022 45%,
            transparent 75%
          ),
          radial-gradient(
            ellipse 50% 38% at 74% 68%,
            #ffb34744 0%,
            #ffb34718 45%,
            transparent 75%
          ),
          radial-gradient(
            ellipse 90% 35% at 50% 95%,
            #7666ff38 0%,
            #7666ff14 45%,
            transparent 80%
          )
        `,
                    filter: "blur(22px)",
                    opacity: 1,
                    transform:
                      "translate(-50%, -50%) translateZ(0) scale(1.45)",

                    ["--glow-size" as string]: glowSize.base,
                    ["--glow-size-md" as string]: glowSize.md,
                    ["--glow-size-lg" as string]: glowSize.lg,
                  }}
                />

                <Image
                  src={imageSrc}
                  alt={`${teamName} team`}
                  width={900}
                  height={500}
                  className={
                    teamSlug === "community"
                      ? "w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full object-cover relative z-12"
                      : "w-full max-w-[250px] md:max-w-[350px] lg:max-w-[400px] rounded-2xl object-cover relative z-12"
                  }
                />
              </div>

              {/* Gold glow behind image — reduced blur cost */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-40 lg:-top-50 md:top-2 w-[1000px] md:w-[1000px] lg:w-[1900px] pointer-events-none z-10">
                <Image
                  src="/products/gold-4.webp"
                  alt=""
                  width={1200}
                  height={600}
                  className="w-full h-auto mix-blend-screen opacity-50 lg:opacity-30 blur-[50px]"
                />
              </div>

              {/* Spirals */}
              <div className="relative z-0 w-full max-w-3xl h-[110px] md:h-[140px] mt-[-6px] md:mt-[-10px] pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 -top-19 md:-top-20 w-[1360px] lg:w-570 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-18 md:-top-20 w-[1020px] md:w-[1170px] lg:w-480 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-14 md:-top-14 w-[880px] md:w-[1070px] lg:w-410 aspect-[1018/125] opacity-80">
                  <Image
                    src={ASSETS.ID.SPIRAL_CENTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-13 md:-top-14 w-[670px] md:w-[1070px] lg:w-450 aspect-[697/66] opacity-100">
                  <Image
                    src={ASSETS.ID.SPIRAL_INNER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* About the Team card */}
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
                        <div className="justify-start whitespace-nowrap font-['Google_Sans',sans-serif] text-xs leading-4 font-normal text-white sm:text-sm sm:leading-5 md:text-lg md:leading-7 lg:text-2xl lg:leading-9">
                          {cat}
                        </div>
                      </div>
                    ))}
                  </>
                }
              />
            </div>
          </Stack>

          {/* ── Current Team Leads ── */}
          <TeamLeadsGrid teamSlug={teamSlug} />

          {/* ── Team Structure + Dropdowns ── */}
          <TeamStructureDropdowns
            content={content}
            hideSupportGroup={hideSupportGroup}
            titleGradient={titleGradient}
          />
        </Stack>
      </Container>
    </div>
  );
}
