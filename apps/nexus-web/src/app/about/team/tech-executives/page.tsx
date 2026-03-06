import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-tech-executives";

const TECH_EXECUTIVES_MEMBERS = [
  {
    name: "Carlos Jerico Dela Torre",
    role: "Chief Technology Officer (CTO)",
    imageSrc: `${BASE}/carlos-jerico-dela-torre.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Aurold John Sadullo",
    role: "DCTO for Infrastructure and Intelligence",
    imageSrc: `${BASE}/aurold-john-sadullo.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Nyzel Cayat",
    role: "DCTO for Development and Experience",
    imageSrc: `${BASE}/nyzel-cayat.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Mhyca Monterola",
    role: "Technology Communications Officer (TCO)",
    imageSrc: `${BASE}/mhyca-monterola.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Strawberry Pink Balasbas",
    role: "Technical Documentations Officer (TDO)",
    imageSrc: `${BASE}/strawberry-pink-balasbas.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function TechExecutivesPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Technology Executives
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {TECH_EXECUTIVES_MEMBERS.map((member) => (
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
