import fs from 'fs';

const teamLeadsPath = 'apps/nexus-web/src/features/products/components/team-structure-section/TeamLeadsGrid.tsx';
let leadsContent = fs.readFileSync(teamLeadsPath, 'utf-8');

leadsContent = leadsContent.replace(
  `  const members =
    TEAM_MEMBERS_BY_SLUG[teamSlug] ??
    TEAM_MEMBERS_BY_SLUG[resolvedTeamSlug] ??
    [];

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
  );`,
  `  const members =
    TEAM_MEMBERS_BY_SLUG[teamSlug] ??
    TEAM_MEMBERS_BY_SLUG[resolvedTeamSlug] ??
    [];

  const groupedMembers = members.reduce((acc, member) => {
    const row = member.row ?? 0;
    if (!acc[row]) acc[row] = [];
    acc[row].push(member);
    return acc;
  }, {} as Record<number, typeof members>);

  const sortedRows = Object.keys(groupedMembers)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => groupedMembers[Number(k)]);

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

      <div className="flex flex-col gap-10 lg:gap-15 mt-10 lg:mt-15">
        {sortedRows.map((rowMembers, idx) => (
          <div key={idx} className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {rowMembers.map((member) => (
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
        ))}
      </div>
    </Stack>
  );`
);

fs.writeFileSync(teamLeadsPath, leadsContent);


const teamSectionPath = 'apps/nexus-web/src/features/about/components/TeamSection.tsx';
let sectionContent = fs.readFileSync(teamSectionPath, 'utf-8');

// The SECTION_CONTENT spans lines 408 to 619
const startToken = "const SECTION_CONTENT = React.useMemo(() => ({";
const endToken = "  }), []);";

const startIndex = sectionContent.indexOf(startToken);
const endIndex = sectionContent.indexOf(endToken) + endToken.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `  const renderTeamGroup = React.useCallback((slug: string) => {
    const members = TEAM_MEMBERS_BY_SLUG[slug] ?? [];
    const groupedMembers = members.reduce((acc, member) => {
      const row = member.row ?? 0;
      if (!acc[row]) acc[row] = [];
      acc[row].push(member);
      return acc;
    }, {} as Record<number, typeof members>);
    
    const sortedRows = Object.keys(groupedMembers)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => groupedMembers[Number(k)]);

    return (
      <div className="flex flex-col gap-10 lg:gap-15 mt-10 lg:mt-15">
        {sortedRows.map((rowMembers, idx) => (
          <div key={idx} className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {rowMembers.map((member) => (
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
        ))}
      </div>
    );
  }, []);

  // Section content map
  const SECTION_CONTENT = React.useMemo(() => ({
    administrative: renderTeamGroup("administrative"),
    marketing: renderTeamGroup("marketing"),
    creatives: renderTeamGroup("creatives"),
    operations: renderTeamGroup("operations"),
    "community-relations": renderTeamGroup("community-relations"),
    partnership: renderTeamGroup("partnership"),
    "tech-executives": renderTeamGroup("tech-executives"),
    "project-management": renderTeamGroup("project-management"),
    "web-development": renderTeamGroup("web-development"),
    "ui-ux": renderTeamGroup("ui-ux"),
    cybersecurity: renderTeamGroup("cybersecurity"),
    "cloud-solutions": renderTeamGroup("cloud-solutions"),
    "data-ml": renderTeamGroup("data-ml"),
    "internet-of-things": renderTeamGroup("internet-of-things"),
  }), [renderTeamGroup]);`;

  sectionContent = sectionContent.substring(0, startIndex - 27) + replacement + sectionContent.substring(endIndex);
  fs.writeFileSync(teamSectionPath, sectionContent);
  console.log("Successfully updated TeamSection.tsx");
} else {
  console.log("Could not find SECTION_CONTENT boundaries in TeamSection.tsx");
}
