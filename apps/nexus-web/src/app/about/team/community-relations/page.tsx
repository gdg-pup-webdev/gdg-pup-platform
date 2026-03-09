import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const COMMUNITY_RELATION_MEMBERS = [
  {
    name: "Solomon Nadonga",
    role: "Chief Community Relations Officer (CCRO)",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.SOLOMON_NADONGA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Railley Nieles",
    role: "Deputy Chief Community Relations Officer (DCCRO)",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAILLEY_NIELES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Raymund Jr. Dimacutac",
    role: "Student Development Lead",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAYMUND_DIMACUTAC,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Gerick Eol Hernandez",
    role: "Student Development Co-Lead",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.GERICK_HERNANDEZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Troy Lauren Lazaro",
    role: "Talent Development Lead",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.TROY_LAZARO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Erica Mae Mallari",
    role: "Talent Development Co-Lead",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.ERICA_MALLARI,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marianne Mae Bautista",
    role: "Community Relations Consultant",
    imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.MARIANNE_BAUTISTA,
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
