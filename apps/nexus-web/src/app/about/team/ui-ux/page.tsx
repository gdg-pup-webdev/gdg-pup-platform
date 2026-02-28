import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";
const BASE = "/pages/team/ui-ux";

const UI_UX_MEMBERS = [
  {
    name: "Jedia Nicole Sagun",
    role: "UI/UX Lead",
    imageSrc: `${BASE}/jedia-nicole-sagun.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kassandra Rychelle Balona",
    role: "UI/UX Co-Lead",
    imageSrc: `${BASE}/kassandra-rychelle-balona.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Joyrel Baladjay",
    role: "UI/UX Learning Head Committee",
    imageSrc: `${BASE}/joyrel-baladjay.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Kacey Michaela Solis",
    role: "UI/UX Learning Head Committee",
    imageSrc: `${BASE}/kacey-michaela-solis.png`,
    mascotSrc: MASCOT_SRC,
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" },
  },
];

export default function UIUXPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          UI/UX
        </Text>
      </Stack>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </Stack>
  );
}
