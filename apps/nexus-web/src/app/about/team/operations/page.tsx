import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const OPERATION_MEMBERS = [
  {
    name: "Elija Cabaddu",
    role: "Chief Operations Officer (COO)",
    imageSrc: ASSETS.TEAM.OPERATIONS.ELIJA_CABADDU,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Aifah Mae Maddie",
    role: "Deputy Chief Operations Officer (DCOO)",
    imageSrc: ASSETS.TEAM.OPERATIONS.AIFAH_MADDIE,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jinrikisha Omela",
    role: "Technicals Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.JINRIKISHA_OMELA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Danielle Pauleen Labasa",
    role: "Technicals Co-Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.DANIELLE_LABASA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Charles Lalata",
    role: "Technicals Senior Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.CHARLES_LALATA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Eugene Gonzaga",
    role: "Technicals Junior Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.EUGENE_GONZAGA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Maria Angeline Aguirre",
    role: "Programs Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.MARIA_AGUIRRE,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jade Micah Lazaro",
    role: "Programs Co-Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.JADE_LAZARO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kishey Ibañez",
    role: "Logistics Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.KISHEY_IBANEZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Alessa Estaras",
    role: "Logistics Co-Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.ALESSA_ESTARAS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Hans Ezekiel Naperi",
    role: "Documentations Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.HANS_NAPERI,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cali Dominic Ranjo",
    role: "Documentations Co-Lead",
    imageSrc: ASSETS.TEAM.OPERATIONS.CALI_RANJO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function OperationPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Operations
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {OPERATION_MEMBERS.map((member) => (
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
