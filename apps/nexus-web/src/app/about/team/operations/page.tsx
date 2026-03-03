import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/operations";

const OPERATION_MEMBERS = [
  {
    name: "Elija Cabaddu",
    role: "Chief Operations Officer (COO)",
    imageSrc: `${BASE}/elija-cabaddu.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Aifah Mae Maddie",
    role: "Deputy Chief Operations Officer (DCOO)",
    imageSrc: `${BASE}/aifah-mae-maddie.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jinrikisha Omela",
    role: "Technicals Lead",
    imageSrc: `${BASE}/jinrikisha-omela.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Danielle Pauleen Labasa",
    role: "Technicals Co-Lead",
    imageSrc: `${BASE}/danielle-pauleen-labasa.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Charles Lalata",
    role: "Technicals Senior Lead",
    imageSrc: `${BASE}/charles-lalata.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Eugene Gonzaga",
    role: "Technicals Junior Lead",
    imageSrc: `${BASE}/eugene-gonzaga.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Maria Angeline Aguirre",
    role: "Programs Lead",
    imageSrc: `${BASE}/maria-angeline-aguirre.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jade Micah Lazaro",
    role: "Programs Co-Lead",
    imageSrc: `${BASE}/jade-micah-lazaro.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kishey Ibañez",
    role: "Logistics Lead",
    imageSrc: `${BASE}/kishey-ibanez.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Alessa Estaras",
    role: "Logistics Co-Lead",
    imageSrc: `${BASE}/alessa-estaras.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Hans Ezekiel Naperi",
    role: "Documentations Lead",
    imageSrc: `${BASE}/hans-ezekiel-naperi.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cali Dominic Ranjo",
    role: "Documentations Co-Lead",
    imageSrc: `${BASE}/cali-dominic-ranjo.png`,
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
