import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-ui-ux";

const UI_UX_MEMBERS = [
  {
    name: "Jedia Nicole Sagun",
    role: "UI/UX Lead",
    imageSrc: `${BASE}/jedia-nicole-sagun.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kassandra Rychelle Balona",
    role: "UI/UX Co-Lead",
    imageSrc: `${BASE}/kassandra-rychelle-balona.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joyrel Baladjay",
    role: "UI/UX Learning Head Committee",
    imageSrc: `${BASE}/joyrel-baladjay.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kacey Michaela Solis",
    role: "UI/UX Learning Head Committee",
    imageSrc: `${BASE}/kacey-michaela-solis.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function UIUXPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          UI/UX
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {UI_UX_MEMBERS.map((member) => (
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
