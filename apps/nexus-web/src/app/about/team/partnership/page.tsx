import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-partnership";

const PARTNERSHIP_MEMBERS = [
  {
    name: "Mark Joseph Neypes",
    role: "Chief Partnership Relations Officer (CPRO)",
    imageSrc: `${BASE}/mark-joseph-neypes.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Honeylet Igot",
    role: "Deputy Chief Partnership Relations Officer (DCPRO)",
    imageSrc: `${BASE}/honeylet-igot.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Elijah Jonathan De Guzman",
    role: "Deputy Chief Partnership Relations Officer (DCPRO)",
    imageSrc: `${BASE}/elijah-jonathan-de-guzman.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joewen Bragasin",
    role: "Community Partnerships Lead",
    imageSrc: `${BASE}/joewen-bragasin.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Caryl Joy Atienza",
    role: "Community Partnerships Co-Lead",
    imageSrc: `${BASE}/caryl-joy-atienza.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Angeline Magdaluyo",
    role: "Industry Partnerships Lead",
    imageSrc: `${BASE}/angeline-magdaluyo.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Mary Ruth Relator",
    role: "Industry Partnerships Co-Lead",
    imageSrc: `${BASE}/mary-ruth-relator.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Arjay Rosel",
    role: "Partnership Consultant",
    imageSrc: `${BASE}/arjay-rosel.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Oaing",
    role: "Partnerships Coordinator",
    imageSrc: `${BASE}/emmanuel-oaing.webp`,
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
