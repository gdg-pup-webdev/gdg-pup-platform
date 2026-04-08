import Link from "next/link";
import { Stack, Text, Button } from "@packages/spark-ui";
import { TeamDropdowns } from "../TeamDropdowns";
import type { TeamContent } from "../../data/team-content";

interface TeamStructureDropdownsProps {
  content?: TeamContent;
}

export function TeamStructureDropdowns({ content }: TeamStructureDropdownsProps) {
  return (
    <Stack gap="xl" className="mt-16 items-center">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
      >
        TEAM STRUCTURE
      </Text>

      <div className="w-full max-w-[1600px] mt-10 lg:mt-15">
        <TeamDropdowns
          memberLevelTitle={content?.memberLevelTitle}
          memberLevelDescription={content?.memberLevelDescription}
          supportGroupTitle={content?.supportGroupTitle}
          supportGroupDescription={content?.supportGroupDescription}
          supportGroupSecondaryTitle={content?.supportGroupSecondaryTitle}
          supportGroupSecondaryDescription={content?.supportGroupSecondaryDescription}
        />
      </div>

      <Link href="/products">
        <Button size="lg">Back to Resources</Button>
      </Link>
    </Stack>
  );
}
