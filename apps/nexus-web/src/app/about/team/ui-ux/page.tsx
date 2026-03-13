import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const UI_UX_MEMBERS = [
  {
    name: "Jedia Nicole Sagun",
    role: "UI/UX Lead",
    imageSrc: ASSETS.TEAM.UI_UX.JEDIA_SAGUN,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kassandra Rychelle Balona",
    role: "UI/UX Co-Lead",
    imageSrc: ASSETS.TEAM.UI_UX.KASSANDRA_BALONA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joyrel Baladjay",
    role: "UI/UX Learning Head Committee",
    imageSrc: ASSETS.TEAM.UI_UX.JOYREL_BALADJAY,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kacey Michaela Solis",
    role: "UI/UX Learning Head Committee",
    imageSrc: ASSETS.TEAM.UI_UX.KACEY_SOLIS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function UIUXPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
          UI/UX
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {UI_UX_MEMBERS.map((member) => (
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




