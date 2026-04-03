import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const TECH_EXECUTIVES_MEMBERS = [
  {
    name: "Carlos Jerico Dela Torre",
    role: "Chief Technology Officer (CTO)",
    imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.CARLOS_DE_LA_TORRE,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Aurold John Sadullo",
    role: "DCTO for Infrastructure and Intelligence",
    imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.AUROLD_SADULLO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Nyzel Cayat",
    role: "DCTO for Development and Experience",
    imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.NYZEL_CAYAT,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Mhyca Monterola",
    role: "Technology Communications Officer (TCO)",
    imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.MHYCA_MONTEROLA,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Strawberry Pink Balasbas",
    role: "Technical Documentations Officer (TDO)",
    imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.STRAWBERRY_BALASBAS,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function TechExecutivesPage() {
  return (
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs">
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
        >
          Technology Executives
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {TECH_EXECUTIVES_MEMBERS.map((member) => (
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




