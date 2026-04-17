import { Stack, Text, TeamCard } from "@packages/spark-ui";
import { TEAM_MEMBERS_BY_SLUG } from "./team-members.data";

interface TeamLeadsGridProps {
  teamSlug: string;
}

const TEAM_SLUG_ALIASES: Record<string, string> = {
  executives: "tech-executives",
};

export function TeamLeadsGrid({ teamSlug }: TeamLeadsGridProps) {
  const resolvedTeamSlug = TEAM_SLUG_ALIASES[teamSlug] ?? teamSlug;
  const members = TEAM_MEMBERS_BY_SLUG[resolvedTeamSlug] ?? [];

  return (
    <Stack gap="xl" className="mt-16">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        CURRENT TEAM LEADS
      </Text>

      <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-10 lg:mt-15">
        {members.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            mascotSrc={member.mascotSrc}
            socials={member.socials}
            className="w-full max-w-[14.8rem] lg:max-w-[17rem] xl:max-w-[19rem]"
          />
        ))}
      </div>
    </Stack>
  );
}
