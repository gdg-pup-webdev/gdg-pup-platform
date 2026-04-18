"use client";
import { Text } from "@packages/spark-ui";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Ref } from "react";
import { MdDragIndicator } from "react-icons/md";
import { MdCalendarMonth } from "react-icons/md";
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

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const formatDateLabel = (value?: string | null): string => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDateMatch) {
    const normalizedDate = `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}T00:00:00Z`;
    const parsed = new Date(normalizedDate);
    if (!Number.isNaN(parsed.getTime())) {
      return displayDateFormatter.format(parsed);
    }
  }

  const parsedFallback = new Date(trimmed);
  if (!Number.isNaN(parsedFallback.getTime())) {
    return displayDateFormatter.format(parsedFallback);
  }

  return trimmed;
};

const formatProjectDateRange = (startDate?: string, endDate?: string | null): string => {
  const startLabel = formatDateLabel(startDate);
  const endLabel = formatDateLabel(endDate);

  if (startLabel && endLabel) {
    return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
  }

  if (startLabel) {
    return startLabel;
  }

  if (endLabel) {
    return endLabel;
  }

  return "Date not set";
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
  const projectDateRange = formatProjectDateRange(project.startDate, project.endDate);

  if (!project) return null;

  return (
    <article
      className={`group/project-card rounded-2xl border bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition ${
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
            className="min-w-0 flex-1 pr-2"
          >
            <span className="relative block min-w-0">
              <Text
                as="span"
                variant="body"
                weight="medium"
                className="block truncate text-white transition-opacity duration-200 group-hover/project-card:opacity-0"
              >
                {project.title}
              </Text>
              <Text
                as="span"
                variant="body"
                weight="bold"
                gradient="yellow"
                className="pointer-events-none absolute inset-0 block truncate opacity-0 transition-opacity duration-200 group-hover/project-card:opacity-100"
              >
                {project.title}
              </Text>
            </span>
          </Link>
        ) : (
          <span className="relative block min-w-0">
            <Text
              as="span"
              variant="body"
              className="block truncate text-white transition-opacity duration-200 group-hover/project-card:opacity-0"
              weight="medium"
            >
              {project.title}
            </Text>
            <Text
              as="span"
              variant="body"
              weight="bold"
              gradient="yellow"
              className="pointer-events-none absolute inset-0 block truncate opacity-0 transition-opacity duration-200 group-hover/project-card:opacity-100"
            >
              {project.title}
            </Text>
          </span>
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
          <div className="mt-1 flex items-center gap-1.5 text-[#C1C7CD]">
            <MdCalendarMonth className="h-4 w-4 shrink-0" aria-hidden="true" />
            <Text as="span" variant="body-sm" className="text-[#C1C7CD]">
              {projectDateRange}
            </Text>
          </div>

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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}
        </Link>
      ) : (
        <>
          <div className="mt-1 flex items-center gap-1.5 text-[#C1C7CD]">
            <MdCalendarMonth className="h-4 w-4 shrink-0" aria-hidden="true" />
            <Text as="span" variant="body-sm" className="text-[#C1C7CD]">
              {projectDateRange}
            </Text>
          </div>

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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}
