import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const CREATIVES_MEMBERS = [
  {
    name: "Ayen Mejorada",
    role: "Chief Creatives Officer (CCO)",
    imageSrc: ASSETS.TEAM.CREATIVES.AYEN_MEJORADA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Hesed Suñga",
    role: "Deputy Chief Creatives Officer (DCCO)",
    imageSrc: ASSETS.TEAM.CREATIVES.HESED_SUNGA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Daniella J. Mendoza",
    role: "Graphic Design Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.DANIELLA_MENDOZA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Michael Marquez",
    role: "Social Media Manager Co-Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.MICHAEL_MARQUEZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Alecza Patrice Bonifacio",
    role: "Branding & Assets Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.ALECZA_BONIFACIO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cyruz Cordero Arcan",
    role: "Branding & Assets Co-Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.CYRUZ_ARCAN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Matthew Erivera Cucio",
    role: "Audio & Visuals Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.MATTHEW_CUCIO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emanuel Jabon",
    role: "Audio & Visuals Co-Lead",
    imageSrc: ASSETS.TEAM.CREATIVES.EMANUEL_JABON,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CreativesPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Creatives
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {CREATIVES_MEMBERS.map((member) => (
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
