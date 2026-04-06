"use client";
import { Text } from "@packages/spark-ui";
import { formatDate } from "@/lib/utils"; // If formatDate exists, otherwise simple string formats. Wait, I'll just use raw string for now and keep it simple.

export function ProjectCard({ project }: { project: any }) {
  if (!project) return null;

  return (
    <article className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <Text variant="body" className="text-white" weight="medium">
        {project.title}
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
        {project.startDate} {project.endDate ? `· ${project.endDate}` : ""}
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#E5E5E5] whitespace-pre-line">
        {project.description}
      </Text>
      {project.mainImageUrl && (
        <img
          src={project.mainImageUrl}
          alt={project.title || "Project preview"}
          className="mt-2 h-20 w-full rounded-md object-cover" 
        />
      )}
    </article>
  );
}
