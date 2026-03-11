import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";
import { ASSETS } from "@/lib/constants/assets";

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

const DATA_ML_MEMBERS = [
  {
    name: "Kian Angelo Florendo",
    role: "Data and Machine Learning Lead",
    imageSrc: ASSETS.TEAM.DATA_ML.KIAN_FLORENDO,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Francen Venisse Red",
    role: "Data and Machine Learning Co-Lead",
    imageSrc: ASSETS.TEAM.DATA_ML.FRANCEN_RED,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Yhasmen Nogales",
    role: "Data and Machine Learning Co-Lead",
    imageSrc: ASSETS.TEAM.DATA_ML.YHASMEN_NOGALES,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kurt Anthony Cruz",
    role: "Data and ML Learning Head Committee",
    imageSrc: ASSETS.TEAM.DATA_ML.KURT_CRUZ,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Ram Luis Marmol",
    role: "Data and ML Learning Head Committee",
    imageSrc: ASSETS.TEAM.DATA_ML.RAM_MARMOL,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function DataMLPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Data &amp; Machine Learning
        </Text>
      </Stack>
      <AnimatedTeamGrid>
        {DATA_ML_MEMBERS.map((member) => (
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
