import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;
const BASE = "/team/team-project-management";

const PROJECT_MANAGEMENT_MEMBERS = [
  {
    name: "Patricia Anne Panlilio",
    role: "Project Management Lead",
    imageSrc: `${BASE}/patricia-anne-panlilio.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Lance Gabriel P. Vargas",
    role: "Project Management Co-Lead",
    imageSrc: `${BASE}/lance-gabriel-p-vargas.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Trishia Sai Mejia",
    role: "Project Management Co-Lead",
    imageSrc: `${BASE}/trishia-sai-mejia.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Abielle Viktoria Dig",
    role: "Project Management Secretary",
    imageSrc: `${BASE}/abielle-viktoria-dig.webp`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function ProjectManagementPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Project Management
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {PROJECT_MANAGEMENT_MEMBERS.map((member) => (
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
