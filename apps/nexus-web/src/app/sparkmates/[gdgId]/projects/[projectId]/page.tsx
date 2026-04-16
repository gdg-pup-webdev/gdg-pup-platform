"use client";

import { useParams } from "next/navigation";
import { ProjectDetailsView } from "@/features/sparkmates/components/ProjectDetailsView";

export default function PublicProjectDetailsPage() {
  const params = useParams<{ gdgId: string; projectId: string }>();
  const gdgId = params?.gdgId ?? "";
  const projectId = params?.projectId ?? "";

  return (
    <ProjectDetailsView
      projectId={projectId}
      backHref={`/sparkmates/${gdgId}/projects`}
      expectedMemberGdgId={gdgId}
      ctaLabel="View All Projects"
    />
  );
}
