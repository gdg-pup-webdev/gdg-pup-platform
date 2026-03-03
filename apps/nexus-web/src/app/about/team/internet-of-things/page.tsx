import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/internet-of-things";

const IOT_MEMBERS = [
  {
    name: "Daniel Rein Cosare",
    role: "IoT Lead",
    imageSrc: `${BASE}/daniel-rein-cosare.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Carl Melvin A. Erosa",
    role: "IoT Co-Lead",
    imageSrc: `${BASE}/carl-melvin-a-erosa.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Shan Allen T. Rivera",
    role: "IoT Learning Head Committee",
    imageSrc: `${BASE}/shan-allen-t-rivera.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function InternetOfThingsPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Internet of Things
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {IOT_MEMBERS.map((member) => (
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
