import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { AnimatedTeamGrid } from "@/features/about";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/data-ml";

const DATA_ML_MEMBERS = [
  {
    name: "Kian Angelo Florendo",
    role: "Data and Machine Learning Lead",
    imageSrc: `${BASE}/kian-angelo-florendo.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Francen Venisse Red",
    role: "Data and Machine Learning Co-Lead",
    imageSrc: `${BASE}/francen-venisse-red.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Yhasmen Nogales",
    role: "Data and Machine Learning Co-Lead",
    imageSrc: `${BASE}/yhasmen-nogales.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kurt Anthony Cruz",
    role: "Data and ML Learning Head Committee",
    imageSrc: `${BASE}/kurt-anthony-cruz.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Ram Luis Marmol",
    role: "Data and ML Learning Head Committee",
    imageSrc: `${BASE}/ram-luis-marmol.png`,
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
