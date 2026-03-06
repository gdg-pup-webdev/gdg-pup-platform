import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-marketing";

const MARKETING_MEMBERS = [
  {
    name: "Gianne Crizzle Dasco",
    role: "Chief Marketing Officer (CMO)",
    imageSrc: `${BASE}/gianne-crizzle-dasco.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Viviene Tricia Rabano",
    role: "Deputy Chief Marketing Officer (DCMO)",
    imageSrc: `${BASE}/viviene-tricia-rabano.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Victoria Estilong Balgos",
    role: "Social Media Manager Lead",
    imageSrc: `${BASE}/victoria-estilong-balgos.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Charles Matthew Pacuan",
    role: "Social Media Manager Co-Lead",
    imageSrc: `${BASE}/charles-matthew-pacuan.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "David Monterde Gabriel Jr.",
    role: "Social Media Manager Co-Lead",
    imageSrc: `${BASE}/david-monterde-gabriel-jr.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jade Shana Emit Naig",
    role: "Content Writer Lead",
    imageSrc: `${BASE}/jade-shana-emit-naig.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Ethaniel Klymore Sales",
    role: "Content Writer Co-Lead",
    imageSrc: `${BASE}/ethaniel-klymore-sales.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Andrei Basco",
    role: "Content Calendar Manager Lead",
    imageSrc: `${BASE}/emmanuel-andrei-basco.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Clarissa Jasmine Dela Cruz",
    role: "Content Manager Co-Lead",
    imageSrc: `${BASE}/clarissa-jasmine-dela-cruz.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joshua Tanawan",
    role: "Content Creation Lead",
    imageSrc: `${BASE}/joshua-tanawan.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marky Cortezo",
    role: "Content Creation Co-Lead",
    imageSrc: `${BASE}/marky-cortezo.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function MarketingPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Marketing
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {MARKETING_MEMBERS.map((member) => (
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
