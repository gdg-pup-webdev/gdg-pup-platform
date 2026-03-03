import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/administrative";

const ADMINISTRATIVE_MEMBERS = [
  {
    name: "Randy Carlo Lorenzo",
    role: "Chapter Lead and President",
    imageSrc: `${BASE}/randy-carlo-lorenzo.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Shunrenn Locaylocay",
    role: "Chief Executive Officer (CEO)",
    imageSrc: `${BASE}/shunrenn-locaylocay.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Syruz Ken Domingo",
    role: "Placeholder",
    imageSrc: `${BASE}/syruz-ken-domingo.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kurt Lopez",
    role: "Deputy Chief Secretariat (DCSec)",
    imageSrc: `${BASE}/kurt-lopez.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Cathyren Sacatani",
    role: "Chief Finance Officer (CFO)",
    imageSrc: `${BASE}/cathyren-sacatani.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Irah Markeisha Jose",
    role: "Deputy Chief Finance Officer (DCFO)",
    imageSrc: `${BASE}/irah-markeisha-jose.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Maryrose Marquez",
    role: "Treasurer",
    imageSrc: `${BASE}/maryrose-marquez.png`,
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
