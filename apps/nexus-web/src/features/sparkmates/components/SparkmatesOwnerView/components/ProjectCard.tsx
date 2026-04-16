"use client";
import { Text } from "@packages/spark-ui";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Ref } from "react";
import { MdDragIndicator } from "react-icons/md";
import Link from "next/link";
import { editIcon } from "../icons/editIcon";

type ProjectLike = {
  title?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  images?: string[] | null;
  imageUrls?: string[] | null;
  image_urls?: string[] | null;
  mainImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  tertiaryImageUrl?: string | null;
  main_image_url?: string | null;
  secondary_image_url?: string | null;
  tertiary_image_url?: string | null;
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
  truncateDescription?: boolean;
  projectHref?: string;
};

function toImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (value && typeof value === "object") {
    const candidate =
      (value as { imageUrl?: unknown }).imageUrl ??
      (value as { image_url?: unknown }).image_url ??
      (value as { url?: unknown }).url ??
      (value as { publicUrl?: unknown }).publicUrl ??
      (value as { previewUrl?: unknown }).previewUrl;

    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
  }

  return null;
}

const normalizeImageList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .map((entry) => toImageUrl(entry))
    .filter((entry): entry is string => Boolean(entry));

  return [...new Set(normalized)];
};

const normalizeProjectImages = (project: ProjectLike): string[] => {
  const images = normalizeImageList(project.images);
  if (images.length > 0) {
    return images;
  }

  const imageUrls = normalizeImageList(project.imageUrls);
  if (imageUrls.length > 0) {
    return imageUrls;
  }

  const snakeCaseImageUrls = normalizeImageList(project.image_urls);
  if (snakeCaseImageUrls.length > 0) {
    return snakeCaseImageUrls;
  }

  return [
    project.mainImageUrl,
    project.secondaryImageUrl,
    project.tertiaryImageUrl,
    project.main_image_url,
    project.secondary_image_url,
    project.tertiary_image_url,
  ]
    .map((entry) => toImageUrl(entry))
    .filter((entry): entry is string => Boolean(entry));
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
  truncateDescription = false,
  projectHref,
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
        {projectHref ? (
          <Link
            href={projectHref}
            className="text-white font-medium text-base hover:text-[#8FC5FF] transition-colors"
          >
            {project.title}
          </Link>
        ) : (
          <Text variant="body" className="text-white" weight="medium">
            {project.title}
          </Text>
        )}
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

      {projectHref ? (
        <Link href={projectHref} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57CAFF]/70">
          <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
            {project.startDate} {project.endDate ? `· ${project.endDate}` : ""}
          </Text>

          <Text
            variant="body-sm"
            className={`mt-1 whitespace-pre-line text-[#E5E5E5] ${
              truncateDescription
                ? "overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
                : ""
            }`}
          >
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
        </Link>
      ) : (
        <>
          <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
            {project.startDate} {project.endDate ? `· ${project.endDate}` : ""}
          </Text>

          <Text
            variant="body-sm"
            className={`mt-1 whitespace-pre-line text-[#E5E5E5] ${
              truncateDescription
                ? "overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
                : ""
            }`}
          >
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
        </>
      )}
    </article>
  );
}
