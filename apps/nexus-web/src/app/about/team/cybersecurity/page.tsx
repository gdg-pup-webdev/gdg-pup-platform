import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const CYBERSECURITY_MEMBERS = [
  {
    name: "Clarisse Jem Salazar",
    role: "Cybersecurity Lead",
    imageSrc: ASSETS.TEAM.CYBERSECURITY.CLARISSE_SALAZAR,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "John Victor Claudio Duatin",
    role: "Cybersecurity Co-Lead",
    imageSrc: ASSETS.TEAM.CYBERSECURITY.JOHN_DUATIN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Salvador Vincent Javier",
    role: "Cybersecurity Learning Head Committee",
    imageSrc: ASSETS.TEAM.CYBERSECURITY.SALVADOR_JAVIER,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Mutas",
    role: "Cybersecurity Learning Head Committee",
    imageSrc: ASSETS.TEAM.CYBERSECURITY.EMMANUEL_MUTAS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CybersecurityPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
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




