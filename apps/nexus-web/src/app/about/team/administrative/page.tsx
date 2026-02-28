import { Stack, Text, TeamCard } from "@packages/spark-ui";

const MASCOT_SRC = "/pages/team/mascot.png";

const ADMINISTRATIVE_MEMBERS = [
  {
    name: "Randy Carlo Lorenzo",
    role: "Chapter Lead",
    imageSrc: "/pages/team/administrative/randy-carlo-lorenzo.png",
    mascotSrc: MASCOT_SRC,
    socials: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
      facebook: "#",
    },
  },
  {
    name: "Shunrenn",
    role: "Chief Executive Officer",
    imageSrc: "/pages/team/administrative/randy-carlo-lorenzo.png",
    mascotSrc: MASCOT_SRC,
    socials: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
      facebook: "#",
    },
  },
];

export default function AdministrativePage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="heading-3" weight="bold" gradient="white-yellow">
          Administrative
        </Text>
        <Text variant="body" className="text-white/50">
          The core team keeping GDG PUP running.
        </Text>
      </Stack>
      <div className="grid grid-cols-2 gap-4 p-3 sm:grid-cols-3 lg:grid-cols-4">
        {ADMINISTRATIVE_MEMBERS.map((member) => (
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
