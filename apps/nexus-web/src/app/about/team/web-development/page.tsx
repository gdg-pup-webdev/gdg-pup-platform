import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const WEB_DEVELOPMENT_MEMBERS = [
  {
    name: "Erwin Daguinotas",
    role: "Web Development Lead",
    imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.ERWIN_DAGUINOTAS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Rhandie Sales Jr.",
    role: "Web Development Co-Lead",
    imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.RHANDIE_SALES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Daniella Simara",
    role: "Web Development Learning Head Committee",
    imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.DANIELLA_SIMARA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Gerald Berongoy",
    role: "Web Development Learning Head Committee",
    imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.GERALD_BERONGOY,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function WebDevelopmentPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Web Development
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {WEB_DEVELOPMENT_MEMBERS.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
          />
        ))}
      </AnimatedTeamGrid>
    </Stack>
  );
}
