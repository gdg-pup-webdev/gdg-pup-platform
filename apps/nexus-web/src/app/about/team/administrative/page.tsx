import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const ADMINISTRATIVE_MEMBERS = [
  {
    name: "Randy Carlo Lorenzo",
    role: "Chapter Lead and President",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.RANDY_CARLO_LORENZO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Shunrenn Locaylocay",
    role: "Chief Executive Officer (CEO)",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SHUNRENN_LOCAYLOCAY,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Syruz Ken Domingo",
    role: "Placeholder",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SYRUZ_KEN_DOMINGO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kurt Lopez",
    role: "Deputy Chief Secretariat (DCSec)",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.KURT_LOPEZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cathyren Sacatani",
    role: "Chief Finance Officer (CFO)",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.CATHYREN_SACATANI,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Irah Markeisha Jose",
    role: "Deputy Chief Finance Officer (DCFO)",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.IRAH_JOSE,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Maryrose Marquez",
    role: "Treasurer",
    imageSrc: ASSETS.TEAM.ADMINISTRATIVE.MARYROSE_MARQUEZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function AdministrativePage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Administrative
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {ADMINISTRATIVE_MEMBERS.map((member) => (
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
