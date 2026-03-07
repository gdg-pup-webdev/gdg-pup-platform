import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-creatives";

const CREATIVES_MEMBERS = [
  {
    name: "Ayen Mejorada",
    role: "Chief Creatives Officer (CCO)",
    imageSrc: `${BASE}/ayen-mejorada.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Hesed Suñga",
    role: "Deputy Chief Creatives Officer (DCCO)",
    imageSrc: `${BASE}/hesed-sunga.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Daniella J. Mendoza",
    role: "Graphic Design Lead",
    imageSrc: `${BASE}/daniella-j-mendoza.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Michael Marquez",
    role: "Social Media Manager Co-Lead",
    imageSrc: `${BASE}/michael-marquez.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Alecza Patrice Bonifacio",
    role: "Branding & Assets Lead",
    imageSrc: `${BASE}/alecza-patrice-bonifacio.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cyruz Cordero Arcan",
    role: "Branding & Assets Co-Lead",
    imageSrc: `${BASE}/cyruz-cordero-arcan.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Matthew Erivera Cucio",
    role: "Audio & Visuals Lead",
    imageSrc: `${BASE}/matthew-erivera-cucio.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emanuel Jabon",
    role: "Audio & Visuals Co-Lead",
    imageSrc: `${BASE}/emanuel-jabon.webp`,
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
