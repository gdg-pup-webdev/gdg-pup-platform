import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/marketing";

const MARKETING_MEMBERS = [
  {
    name: "Gianne Crizzle Dasco",
    role: "Chief Marketing Officer (CMO)",
    imageSrc: `${BASE}/gianne-crizzle-dasco.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Viviene Tricia Rabano",
    role: "Deputy Chief Marketing Officer (DCMO)",
    imageSrc: `${BASE}/viviene-tricia-rabano.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Victoria Estilong Balgos",
    role: "Social Media Manager Lead",
    imageSrc: `${BASE}/victoria-estilong-balgos.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Charles Matthew Pacuan",
    role: "Social Media Manager Co-Lead",
    imageSrc: `${BASE}/charles-matthew-pacuan.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "David Monterde Gabriel Jr.",
    role: "Social Media Manager Co-Lead",
    imageSrc: `${BASE}/david-monterde-gabriel-jr.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Jade Shana Emit Naig",
    role: "Content Writer Lead",
    imageSrc: `${BASE}/jade-shana-emit-naig.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Ethaniel Klymore Sales",
    role: "Content Writer Co-Lead",
    imageSrc: `${BASE}/ethaniel-klymore-sales.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Emmanuel Andrei Basco",
    role: "Content Calendar Manager Lead",
    imageSrc: `${BASE}/emmanuel-andrei-basco.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Clarissa Jasmine Dela Cruz",
    role: "Content Manager Co-Lead",
    imageSrc: `${BASE}/clarissa-jasmine-dela-cruz.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joshua Tanawan",
    role: "Content Creation Lead",
    imageSrc: `${BASE}/joshua-tanawan.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Marky Cortezo",
    role: "Content Creation Co-Lead",
    imageSrc: `${BASE}/marky-cortezo.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function MarketingPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Marketing
        </Text>
      </Stack>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
        {MARKETING_MEMBERS.map((member) => (
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
