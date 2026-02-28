import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/tech-executives";

const TECH_EXECUTIVES_MEMBERS = [
  {
    name: "Carlos Jerico Dela Torre",
    role: "Chief Technology Officer (CTO)",
    imageSrc: `${BASE}/carlos-jerico-dela-torre.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Aurold John Sadullo",
    role: "DCTO for Infrastructure and Intelligence",
    imageSrc: `${BASE}/aurold-john-sadullo.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Nyzel Cayat",
    role: "DCTO for Development and Experience",
    imageSrc: `${BASE}/nyzel-cayat.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Mhyca Monterola",
    role: "Technology Communications Officer (TCO)",
    imageSrc: `${BASE}/mhyca-monterola.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Strawberry Pink Balasbas",
    role: "Technical Documentations Officer (TDO)",
    imageSrc: `${BASE}/strawberry-pink-balasbas.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function TechExecutivesPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Technology Executives
        </Text>
      </Stack>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </Stack>
  );
}
