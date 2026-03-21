import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const IOT_MEMBERS = [
  {
    name: "Daniel Rein Cosare",
    role: "IoT Lead",
    imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.DANIEL_COSARE,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Carl Melvin A. Erosa",
    role: "IoT Co-Lead",
    imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.CARL_EROSA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Shan Allen T. Rivera",
    role: "IoT Learning Head Committee",
    imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.SHAN_ALLEN_RIVERA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function InternetOfThingsPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
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




