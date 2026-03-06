import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/cybersecurity";

const CYBERSECURITY_MEMBERS = [
  {
    name: "Clarisse Jem Salazar",
    role: "Cybersecurity Lead",
    imageSrc: `${BASE}/clarisse-jem-salazar.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "John Victor Claudio Duatin",
    role: "Cybersecurity Co-Lead",
    imageSrc: `${BASE}/john-victor-claudio-duatin.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Salvador Vincent Javier",
    role: "Cybersecurity Learning Head Committee",
    imageSrc: `${BASE}/salvador-vincent-javier.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Mutas",
    role: "Cybersecurity Learning Head Committee",
    imageSrc: `${BASE}/emmanuel-mutas.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CybersecurityPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Cybersecurity
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {CYBERSECURITY_MEMBERS.map((member) => (
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
