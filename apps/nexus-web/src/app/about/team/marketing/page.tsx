import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const MARKETING_MEMBERS = [
  {
    name: "Gianne Crizzle Dasco",
    role: "Chief Marketing Officer (CMO)",
    imageSrc: ASSETS.TEAM.MARKETING.GIANNE_DASCO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Viviene Tricia Rabano",
    role: "Deputy Chief Marketing Officer (DCMO)",
    imageSrc: ASSETS.TEAM.MARKETING.VIVIENE_RABANO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Victoria Estilong Balgos",
    role: "Social Media Manager Lead",
    imageSrc: ASSETS.TEAM.MARKETING.VICTORIA_BALGOS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Charles Matthew Pacuan",
    role: "Social Media Manager Co-Lead",
    imageSrc: ASSETS.TEAM.MARKETING.CHARLES_PACUAN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "David Monterde Gabriel Jr.",
    role: "Social Media Manager Co-Lead",
    imageSrc: ASSETS.TEAM.MARKETING.DAVID_GABRIEL,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jade Shana Emit Naig",
    role: "Content Writer Lead",
    imageSrc: ASSETS.TEAM.MARKETING.JADE_NAIG,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Ethaniel Klymore Sales",
    role: "Content Writer Co-Lead",
    imageSrc: ASSETS.TEAM.MARKETING.ETHANIEL_SALES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Andrei Basco",
    role: "Content Calendar Manager Lead",
    imageSrc: ASSETS.TEAM.MARKETING.EMMANUEL_BASCO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Clarissa Jasmine Dela Cruz",
    role: "Content Manager Co-Lead",
    imageSrc: ASSETS.TEAM.MARKETING.CLARISSA_DELA_CRUZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joshua Tanawan",
    role: "Content Creation Lead",
    imageSrc: ASSETS.TEAM.MARKETING.JOSHUA_TANAWAN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marky Cortezo",
    role: "Content Creation Co-Lead",
    imageSrc: ASSETS.TEAM.MARKETING.MARKY_CORTEZO,
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
