import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/cloud-solutions";

const CLOUD_SOLUTION_MEMBERS = [
  {
    name: "Kyla Marie Agapito",
    role: "Cloud Solutions Lead",
    imageSrc: `${BASE}/kyla-marie-agapito.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "James Gabriele Torzar",
    role: "Cloud Solutions Co-Lead",
    imageSrc: `${BASE}/james-gabriele-torzar.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Justin Royse Solomon",
    role: "Cloud Solutions Learning Head Committee",
    imageSrc: `${BASE}/justin-royse-solomon.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Raphael Johnathan Flores",
    role: "Cloud Solutions Learning Head Committee",
    imageSrc: `${BASE}/raphael-johnathan-flores.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CloudSolutionPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Cloud Solutions
        </Text>
        <Text variant="body" className="text-white/50">
          Exploring and building on cloud platforms and infrastructure.
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {CLOUD_SOLUTION_MEMBERS.map((member) => (
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
