import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/project-management";

const PROJECT_MANAGEMENT_MEMBERS = [
  {
    name: "Patricia Anne Panlilio",
    role: "Project Management Lead",
    imageSrc: `${BASE}/patricia-anne-panlilio.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Lance Gabriel P. Vargas",
    role: "Project Management Co-Lead",
    imageSrc: `${BASE}/lance-gabriel-p-vargas.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Trishia Sai Mejia",
    role: "Project Management Co-Lead",
    imageSrc: `${BASE}/trishia-sai-mejia.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Abielle Viktoria Dig",
    role: "Project Management Secretary",
    imageSrc: `${BASE}/abielle-viktoria-dig.png`,
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
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </Stack>
  );
}
