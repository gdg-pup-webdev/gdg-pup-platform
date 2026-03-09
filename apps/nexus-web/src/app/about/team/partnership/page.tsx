import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const PARTNERSHIP_MEMBERS = [
  {
    name: "Mark Joseph Neypes",
    role: "Chief Partnership Relations Officer (CPRO)",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.MARK_NEYPES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Honeylet Igot",
    role: "Deputy Chief Partnership Relations Officer (DCPRO)",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.HONEYLET_IGOT,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Elijah Jonathan De Guzman",
    role: "Deputy Chief Partnership Relations Officer (DCPRO)",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.ELIJAH_DE_GUZMAN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joewen Bragasin",
    role: "Community Partnerships Lead",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.JOEWEN_BRAGASIN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Caryl Joy Atienza",
    role: "Community Partnerships Co-Lead",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.CARYL_ATIENZA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Angeline Magdaluyo",
    role: "Industry Partnerships Lead",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.ANGELINE_MAGDALUYO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Mary Ruth Relator",
    role: "Industry Partnerships Co-Lead",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.MARY_RELATOR,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Arjay Rosel",
    role: "Partnership Consultant",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.ARJAY_ROSEL,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Oaing",
    role: "Partnerships Coordinator",
    imageSrc: ASSETS.TEAM.PARTNERSHIP.EMMANUEL_OAING,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "https://www.facebook.com/emmanueloaing" },
  },
];

export default function PartnershipPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Partnership
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {PARTNERSHIP_MEMBERS.map((member) => (
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
