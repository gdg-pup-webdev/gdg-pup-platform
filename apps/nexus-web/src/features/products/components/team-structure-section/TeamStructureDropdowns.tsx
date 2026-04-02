import Link from "next/link";
import { Stack, Text, Button } from "@packages/spark-ui";
import { TeamDropdowns } from "../TeamDropdowns";

interface TeamStructureDropdownsProps {
  teamSlug: string;
}

export function TeamStructureDropdowns({ teamSlug }: TeamStructureDropdownsProps) {
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
        <TeamDropdowns />
      </div>

      <Link href="/products">
        <Button size="lg">Back to Resources</Button>
      </Link>
    </Stack>
  );
}
