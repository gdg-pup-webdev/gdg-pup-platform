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
    <Stack gap="xl" className="w-full max-md:items-center">
      <Stack gap="xs" className="w-full">
        <div className="hidden md:grid grid-cols-4 items-end w-full gap-4">
          <Text
            variant="heading-4"
            weight="bold"
            gradient="white-yellow"
            className="col-span-2 ml-3 whitespace-nowrap"
          >
            Administrative
          </Text>
          <Text
            variant="heading-4"
            weight="bold"
            gradient="white-yellow"
            className="col-span-2 ml-3 whitespace-nowrap"
          >
            Secretariat
          </Text>
        </div>
        <Text
          variant="heading-4"
          weight="bold"
          gradient="white-yellow"
          className="ml-3 max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1] md:hidden"
        >
          Administrative
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {ADMINISTRATIVE_MEMBERS.slice(0, 4).map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
          />
        ))}
        <div data-grid-span="full">
          <Text
            variant="heading-4"
            weight="bold"
            gradient="white-yellow"
            className="ml-3 whitespace-nowrap max-md:w-full max-md:ml-0 max-md:text-center max-md:self-center max-md:text-[40px] max-md:leading-[1.1]"
          >
            Finance
          </Text>
        </div>
        {ADMINISTRATIVE_MEMBERS.slice(4).map((member) => (
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




