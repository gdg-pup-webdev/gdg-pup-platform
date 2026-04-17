"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { ProjectCard } from "./ProjectCard";

type SortableProjectCardItemProps = {
  id: string;
  project: any;
  onEdit?: () => void;
  sortingDisabled?: boolean;
  handleDisabled?: boolean;
  isDropTarget?: boolean;
  readOnly?: boolean;
  truncateDescription?: boolean;
  projectHref?: string;
};

export function SortableProjectCardItem({
  id,
  project,
  onEdit,
  sortingDisabled = false,
  handleDisabled = false,
  isDropTarget = false,
  readOnly = false,
  truncateDescription = false,
  projectHref,
}: SortableProjectCardItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: sortingDisabled || readOnly });

  const constrainedTransform = transform
    ? {
      ...transform,
      x: 0,
      scaleX: 1,
      scaleY: 1,
    }
    : null;

  const style: CSSProperties = {
    transform: CSS.Transform.toString(constrainedTransform),
    transition,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      data-sortable-project-id={id}
      style={style}
    >
      <ProjectCard
        project={project}
        onEdit={readOnly ? undefined : onEdit}
        showDragHandle={!readOnly}
        dragHandleRef={setActivatorNodeRef}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
        isDragHandleDisabled={handleDisabled || readOnly}
        isDragging={isDragging}
        isDropTarget={isDropTarget}
        truncateDescription={truncateDescription}
        projectHref={projectHref}
      />
    </div>
  );
}
