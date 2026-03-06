import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-community-relations";

const COMMUNITY_RELATION_MEMBERS = [
  {
    name: "Solomon Nadonga",
    role: "Chief Community Relations Officer (CCRO)",
    imageSrc: `${BASE}/solomon-nadonga.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Railley Nieles",
    role: "Deputy Chief Community Relations Officer (DCCRO)",
    imageSrc: `${BASE}/railley-nieles.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Raymund Jr. Dimacutac",
    role: "Student Development Lead",
    imageSrc: `${BASE}/raymund-jr-dimacutac.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Gerick Eol Hernandez",
    role: "Student Development Co-Lead",
    imageSrc: `${BASE}/gerick-eol-hernandez.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Troy Lauren Lazaro",
    role: "Talent Development Lead",
    imageSrc: `${BASE}/troy-lauren-lazaro.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Erica Mae Mallari",
    role: "Talent Development Co-Lead",
    imageSrc: `${BASE}/erica-mae-mallari.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marianne Mae Bautista",
    role: "Community Relations Consultant",
    imageSrc: `${BASE}/marianne-mae-bautista.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CommunityRelationPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Community Relations
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {COMMUNITY_RELATION_MEMBERS.map((member) => (
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
