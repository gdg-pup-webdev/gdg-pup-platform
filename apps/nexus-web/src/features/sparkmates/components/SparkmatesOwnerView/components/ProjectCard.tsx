"use client";
import { Text } from "@packages/spark-ui";

type ProjectLike = {
  title?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  images?: string[] | null;
  mainImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  tertiaryImageUrl?: string | null;
};

type ProjectCardProps = {
  project: ProjectLike;
  onEdit?: () => void;
};

const normalizeProjectImages = (project: ProjectLike): string[] => {
  if (Array.isArray(project.images)) {
    return project.images.filter((image): image is string => Boolean(image));
  }

  return [
    project.mainImageUrl,
    project.secondaryImageUrl,
    project.tertiaryImageUrl,
  ].filter((image): image is string => Boolean(image));
};

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const images = normalizeProjectImages(project);

  if (!project) return null;

  return (
    <article className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <Text variant="body" className="text-white" weight="medium">
          {project.title}
        </Text>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md border border-white/30 px-2 py-1 text-xs text-white transition hover:border-white/60 hover:bg-white/10"
            aria-label="Edit project"
            title="Edit project"
          >
            Edit
          </button>
        )}
      </div>

      <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
        {project.startDate} {project.endDate ? `· ${project.endDate}` : ""}
      </Text>

      <Text variant="body-sm" className="mt-1 whitespace-pre-line text-[#E5E5E5]">
        {project.description}
      </Text>

      {images.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((imageUrl, index) => (
            <img
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={`${project.title || "Project"} preview ${index + 1}`}
              className="h-20 w-28 shrink-0 rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}
