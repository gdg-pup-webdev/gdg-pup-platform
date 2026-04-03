import { Button, Text } from "@packages/spark-ui";
import React from "react";
import { ProjectCard } from "../components/ProjectCard";
import { addIcon } from "../icons/addIcon";
import { viewIcon } from "../icons/viewIcon"; 
import { UserProfile } from "@/features/sparkmates";
import { ASSETS } from "@/lib/constants/assets";

export const ProjectsSection = ({ profile }: { profile: UserProfile }) => {
  const projectImages = [
    ASSETS.PROFILE.DEFAULT_AVATAR,
    ASSETS.PROFILE.DEFAULT_AVATAR,
    ASSETS.PROFILE.DEFAULT_AVATAR,
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Projects
        </Text>
        <Button
          variant="default"
          size="sm"
          className="text-white"
          iconRight={viewIcon}
        >
          View All
        </Button>
      </div>
      <Text variant="body-sm" className="text-[#C1C7CD]">
        Feature your best works to highlight your skills.
      </Text>
      <div className="space-y-3.5">
        {projectImages.map((image, index) => (
          <ProjectCard key={`project-${index}`} image={image} />
        ))}
      </div>
      <Button variant="dashed-outline" className="w-full" iconLeft={addIcon}>
        Add New Projects
      </Button>
    </section>
  );
};
