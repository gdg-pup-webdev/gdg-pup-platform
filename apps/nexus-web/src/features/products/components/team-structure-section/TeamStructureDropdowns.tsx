import Link from "next/link";
import { Stack, Text, Button } from "@packages/spark-ui";
import type { TextVariants } from "@packages/spark-ui";
import { TeamDropdowns } from "../TeamDropdowns";
import type { TeamContent } from "../../data/team-content";

type TeamTitleGradient = NonNullable<TextVariants["gradient"]>;

interface TeamStructureDropdownsProps {
  hideSupportGroup?: boolean;
  titleGradient?: TeamTitleGradient;
  content?: TeamContent;
}

export function TeamStructureDropdowns({
  hideSupportGroup,
  titleGradient,
  content,
}: TeamStructureDropdownsProps) {
  return (
    <Stack gap="xl" className="mt-16 items-center">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        TEAM STRUCTURE
      </Text>
      <Text
        variant="heading-5"
        gradient="white-green"
        align="center"
        weight="bold"
      >
        Who are part of the team?
      </Text>

      <div className="w-full max-w-[1600px] mt-10 lg:mt-15">
        <TeamDropdowns
          hideSupportGroup={hideSupportGroup}
          titleGradient={titleGradient}
          memberLevels={content?.memberLevels}
          memberLevelTitle={content?.memberLevelTitle}
          memberLevelDescription={content?.memberLevelDescription}
          memberLevelSecondaryTitle={content?.memberLevelSecondaryTitle}
          memberLevelSecondaryDescription={
            content?.memberLevelSecondaryDescription
          }
          memberLevelTertiaryTitle={content?.memberLevelTertiaryTitle}
          memberLevelTertiaryDescription={
            content?.memberLevelTertiaryDescription
          }
          memberLevelQuaternaryTitle={content?.memberLevelQuaternaryTitle}
          memberLevelQuaternaryDescription={
            content?.memberLevelQuaternaryDescription
          }
          memberLevelQuinaryTitle={content?.memberLevelQuinaryTitle}
          memberLevelQuinaryDescription={content?.memberLevelQuinaryDescription}
          memberLevelSenaryTitle={content?.memberLevelSenaryTitle}
          memberLevelSenaryDescription={content?.memberLevelSenaryDescription}
          supportGroups={content?.supportGroups}
          supportGroupTitle={content?.supportGroupTitle}
          supportGroupDescription={content?.supportGroupDescription}
          supportGroupSecondaryTitle={content?.supportGroupSecondaryTitle}
          supportGroupSecondaryDescription={
            content?.supportGroupSecondaryDescription
          }
          supportGroupTertiaryTitle={content?.supportGroupTertiaryTitle}
          supportGroupTertiaryDescription={
            content?.supportGroupTertiaryDescription
          }
          supportGroupQuaternaryTitle={content?.supportGroupQuaternaryTitle}
          supportGroupQuaternaryDescription={
            content?.supportGroupQuaternaryDescription
          }
        />
      </div>

      <Link prefetch={false} href="/products">
        <Button size="lg">Back to Resources</Button>
      </Link>
    </Stack>
  );
}
