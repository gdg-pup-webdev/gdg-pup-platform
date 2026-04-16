"use client";

import React from "react";
import { ProjectDetailsView } from "@/features/sparkmates/components/ProjectDetailsView";

export default function PublicProjectDetailsPage({
  params,
}: {
  params: Promise<{ gdgId: string; projectId: string }>;
}) {
  const { gdgId, projectId } = React.use(params);

  return (
    <ProjectDetailsView
      projectId={projectId}
      backHref={`/sparkmates/${gdgId}/projects`}
      expectedMemberGdgId={gdgId}
      ctaLabel="View All Projects"
    />
  );
}
