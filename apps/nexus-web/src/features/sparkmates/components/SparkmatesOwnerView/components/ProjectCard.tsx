"use client";
import { Text } from "@packages/spark-ui";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Ref } from "react";
import { MdDragIndicator } from "react-icons/md";
import { editIcon } from "../icons/editIcon";

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
  showDragHandle?: boolean;
  dragHandleRef?: Ref<HTMLButtonElement>;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: DraggableSyntheticListeners;
  isDragHandleDisabled?: boolean;
  isDragging?: boolean;
  isDragOverlay?: boolean;
  isDropTarget?: boolean;
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

export function ProjectCard({
  project,
  onEdit,
  showDragHandle = false,
  dragHandleRef,
  dragHandleAttributes,
  dragHandleListeners,
  isDragHandleDisabled = false,
  isDragging = false,
  isDragOverlay = false,
  isDropTarget = false,
}: ProjectCardProps) {
  const images = normalizeProjectImages(project);
  const visibleImages = images.slice(0, 4);

  if (!project) return null;

  return (
    <article
      className={`rounded-2xl border bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition ${
        isDropTarget
          ? "border-[#57CAFF]/70 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25),0_0_0_1px_rgba(87,202,255,0.5)]"
          : "border-white/15"
      } ${isDragging ? "opacity-35" : ""} ${
        isDragOverlay
          ? "border-[#57CAFF]/55 bg-[rgba(5,20,45,0.95)] opacity-100 shadow-[0_14px_32px_rgba(0,0,0,0.36)]"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Text variant="body" className="text-white" weight="medium">
          {project.title}
        </Text>
        <div className="flex items-center gap-2">
          {showDragHandle && (
            <button
              type="button"
              ref={dragHandleRef}
              {...dragHandleAttributes}
              {...dragHandleListeners}
              disabled={isDragHandleDisabled}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/30 text-white transition hover:border-white/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Drag to reorder project"
              title="Drag to reorder project"
            >
              <MdDragIndicator className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/30 text-white transition hover:border-white/60 hover:bg-white/10"
              aria-label="Edit project"
              title="Edit project"
            >
              {editIcon}
            </button>
          )}
        </div>
      </div>

      <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
        {project.startDate} {project.endDate ? `· ${project.endDate}` : ""}
      </Text>

      <Text variant="body-sm" className="mt-1 whitespace-pre-line text-[#E5E5E5]">
        {project.description}
      </Text>

      {visibleImages.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {visibleImages.map((imageUrl, index) => (
            <img
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={`${project.title || "Project"} preview ${index + 1}`}
              className="h-20 w-full rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}
