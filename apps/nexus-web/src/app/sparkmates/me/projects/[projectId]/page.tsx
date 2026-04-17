"use client";

import { useParams } from "next/navigation";
import { ProjectDetailsView } from "@/features/sparkmates/components/ProjectDetailsView";

export default function MyProjectDetailsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";

  return (
    <ProjectDetailsView
      projectId={projectId}
      backHref="/sparkmates/me/projects"
      ctaLabel="View Project"
      editable
    />
  );
}
