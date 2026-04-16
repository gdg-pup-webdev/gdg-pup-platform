"use client";

import React from "react";
import { ProjectDetailsView } from "@/features/sparkmates/components/ProjectDetailsView";

export default function MyProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);

  return (
    <ProjectDetailsView
      projectId={projectId}
      backHref="/sparkmates/me/projects"
      ctaLabel="View My Projects"
      editable
    />
  );
}
