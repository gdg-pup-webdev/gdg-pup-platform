import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const PROJECT_MANAGEMENT_MEMBERS = [
  {
    name: "Patricia Anne Panlilio",
    role: "Project Management Lead",
    imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.PATRICIA_PANLILIO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Lance Gabriel P. Vargas",
    role: "Project Management Co-Lead",
    imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.LANCE_VARGAS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Trishia Sai Mejia",
    role: "Project Management Co-Lead",
    imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.TRISHIA_MEJIA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Abielle Viktoria Dig",
    role: "Project Management Secretary",
    imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.ABIELLE_DIG,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function ProjectManagementPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
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




