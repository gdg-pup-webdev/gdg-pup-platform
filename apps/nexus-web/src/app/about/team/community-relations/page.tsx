import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/community-relation";

const COMMUNITY_RELATION_MEMBERS = [
  {
    name: "Solomon Nadonga",
    role: "Chief Community Relations Officer (CCRO)",
    imageSrc: `${BASE}/solomon-nadonga.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Railley Nieles",
    role: "Deputy Chief Community Relations Officer (DCCRO)",
    imageSrc: `${BASE}/railley-nieles.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Raymund Jr. Dimacutac",
    role: "Student Development Lead",
    imageSrc: `${BASE}/raymund-jr-dimacutac.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Gerick Eol Hernandez",
    role: "Student Development Co-Lead",
    imageSrc: `${BASE}/gerick-eol-hernandez.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Troy Lauren Lazaro",
    role: "Talent Development Lead",
    imageSrc: `${BASE}/troy-lauren-lazaro.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Erica Mae Mallari",
    role: "Talent Development Co-Lead",
    imageSrc: `${BASE}/erica-mae-mallari.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marianne Mae Bautista",
    role: "Community Relations Consultant",
    imageSrc: `${BASE}/marianne-mae-bautista.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function CommunityRelationPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Community Relations
        </Text>
      </Stack>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
        {COMMUNITY_RELATION_MEMBERS.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
          />
        ))}
      </div>
    </Stack>
  );
}
