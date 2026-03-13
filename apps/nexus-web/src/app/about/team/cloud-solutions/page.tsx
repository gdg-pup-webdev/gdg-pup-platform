import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const CLOUD_SOLUTION_MEMBERS = [
  {
    name: "Kyla Marie Agapito",
    role: "Cloud Solutions Lead",
    imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.KYLA_AGAPITO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "James Gabriele Torzar",
    role: "Cloud Solutions Co-Lead",
    imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JAMES_TORZAR,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Justin Royse Solomon",
    role: "Cloud Solutions Learning Head Committee",
    imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JUSTIN_SOLOMON,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Raphael Johnathan Flores",
    role: "Cloud Solutions Learning Head Committee",
    imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.RAPHAEL_FLORES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CloudSolutionPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
          Cloud Solutions
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {CLOUD_SOLUTION_MEMBERS.map((member) => (
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




