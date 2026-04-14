import React, { useState } from 'react';
import { Input, Text } from "@packages/spark-ui";
import { ProjectFormState } from "../types";
import { getFileSignature } from "../hooks/useOnboardingForm";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MAX_PROJECT_IMAGES = 4;

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-lg p-px focus-within:p-0.5 bg-[#737373] hover:bg-linear-to-r focus-within:bg-linear-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto py-2 px-3 sm:py-2.5 sm:px-4 !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";


type ProjectsManagerProps = {
  projects: ProjectFormState[];
  updateProject: (index: number, field: keyof Omit<ProjectFormState, "id">, value: string | File | null) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
  singleProjectMode?: boolean;
  imageInputMode?: "legacy" | "list";
  updateProjectImages?: (
    index: number,
    files: File[],
    mode?: "append" | "replace",
  ) => void;
  removeExistingProjectImage?: (index: number, imageIndex: number) => void;
  reorderProjectImages?: (projectIndex: number, fromIndex: number, toIndex: number) => void;
};

const SortableImageItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group/item",
        isDragging && "z-50"
      )}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />
      {children}
    </div>
  );
};

const LocalImagePreview = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => {
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);

    return () => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-400/30 bg-zinc-950/60 h-24">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
          onError={() => setPreviewUrl(null)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-[11px] text-zinc-400">
          Preview unavailable
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black/60 text-[10px] font-bold text-white transition hover:border-red-400 hover:bg-red-500"
        aria-label={`Remove ${file.name}`}
        title="Remove image"
      >
        ✕
      </button>
      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/40 px-2 py-0.5 text-[10px] text-zinc-300 backdrop-blur-sm group-hover/item:visible invisible">
        {file.name}
      </div>
    </div>
  );
};

const UploadedImagePreview = ({
  imageUrl,
  imageIndex,
  onRemove,
}: {
  imageUrl: string;
  imageIndex: number;
  onRemove?: () => void;
}) => {
  const [isBroken, setIsBroken] = React.useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-950/60 h-24">
      {!isBroken ? (
        <img
          src={imageUrl}
          alt={`Uploaded project image ${imageIndex + 1}`}
          className="h-full w-full object-cover"
          onError={() => setIsBroken(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-[11px] text-zinc-400">
          Uploaded unavailable
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black/60 text-[10px] font-bold text-white transition hover:border-red-400 hover:bg-red-500"
          aria-label={`Remove uploaded image ${imageIndex + 1}`}
          title="Remove image"
        >
          ✕
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/40 px-2 py-0.5 text-[10px] text-zinc-400 backdrop-blur-sm group-hover/item:visible invisible">
        Already Uploaded
      </div>
    </div>
  );
};

const getExistingProjectImages = (project: ProjectFormState): string[] => {
  if (Array.isArray(project.imageUrls)) {
    return project.imageUrls;
  }

  return [project.mainImageUrl, project.secondaryImageUrl, project.tertiaryImageUrl].filter(
    (image): image is string => Boolean(image),
  );
};

export function ProjectsManager({
  projects,
  updateProject,
  addProject,
  removeProject,
  singleProjectMode = false,
  imageInputMode = "list",
  updateProjectImages,
  removeExistingProjectImage,
  reorderProjectImages,
}: ProjectsManagerProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, projectIndex: number) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const existingItems = projects[projectIndex].imageOrder || [];

      const oldIndex = existingItems.indexOf(active.id as string);
      const newIndex = existingItems.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderProjectImages?.(projectIndex, oldIndex, newIndex);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      const project = projects[index];
      const existingImages = getExistingProjectImages(project);
      const selectedFiles = project.imageFiles || [];
      const occupiedSlots = existingImages.length + selectedFiles.length;
      const remainingSlots = Math.max(0, MAX_PROJECT_IMAGES - occupiedSlots);
      
      if (imageFiles.length > 0) {
        const nextFiles = imageFiles.slice(0, remainingSlots);
        updateProjectImages?.(index, nextFiles, "append");
      }
    }
  };

  return (
    <div className="mt-6 sm:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <Text className="text-white font-semibold">Projects</Text>
        {!singleProjectMode && (
          <button
            type="button"
            onClick={addProject}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Add project
          </button>
        )}
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={`${project.id ?? "new"}-${index}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3"
          >
            <div className="flex justify-between items-center gap-3">
              <p className="text-sm font-medium text-zinc-300">
                {singleProjectMode ? "Project" : `Project ${index + 1}`}
              </p>
              {!singleProjectMode && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

              <Input
                value={project.title}
                onChange={(event) => updateProject(index, "title", event.target.value)}
                placeholder="Project title"
              containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />

            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              <StyledInputContainer>
                <input
                  type="date"
                  value={project.startDate}
                  onChange={(event) => updateProject(index, "startDate", event.target.value)}
                  className={cn(inputBaseStyles, "min-h-12.5 py-3! w-full bg-[#0a162a] outline-none group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]")}
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <input
                  type="date"
                  value={project.endDate}
                  onChange={(event) => updateProject(index, "endDate", event.target.value)}
                  className={cn(inputBaseStyles, "min-h-12.5 py-3! w-full bg-[#0a162a] outline-none group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]")}
                />
              </StyledInputContainer>
            </div>

            <div className="mt-3">
              <StyledInputContainer>
                <textarea
                  value={project.description}
                  onChange={(event) => updateProject(index, "description", event.target.value)}
                  placeholder="Project description"
                  rows={3}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 text-zinc-200 outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-600 focus:border-blue-500/50"
                />
              </StyledInputContainer>
            </div>

            {imageInputMode === "list" ? (
              <div className="space-y-2">
                <label className="block text-xs text-zinc-400">Project Images (max 4)</label>
                {(() => {
                  const existingImages = getExistingProjectImages(project);
                  const selectedFiles = project.imageFiles || [];
                  const occupiedSlots = existingImages.length + selectedFiles.length;
                  const remainingSlots = Math.max(0, MAX_PROJECT_IMAGES - occupiedSlots);
                  const uploadInputId = `project-images-${index}`;
                  const isDraggingOver = dragOverIndex === index;

                  const sortableItems = project.imageOrder || [];

                  return (
                    <>
                      <input
                        id={uploadInputId}
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={remainingSlots === 0}
                        onChange={(event) => {
                          const files = Array.from(event.target.files || []);
                          const nextFiles = files.slice(0, remainingSlots);
                          updateProjectImages?.(index, nextFiles, "append");
                          event.currentTarget.value = "";
                        }}
                        className="hidden"
                      />

                      <label
                        htmlFor={uploadInputId}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed transition-all cursor-pointer",
                          isDraggingOver 
                            ? "border-blue-500 bg-blue-500/10 scale-[1.01]" 
                            : "border-[#4f75b9]/70 bg-[#0a162a] hover:border-[#7ba7ff] hover:bg-[#122442]",
                          "px-4 py-3 text-sm font-medium text-[#d8e4ff]",
                          remainingSlots === 0 && "pointer-events-none cursor-not-allowed opacity-45",
                        )}
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs leading-none">
                          {isDraggingOver ? "↓" : "+"}
                        </span>
                        <span>
                          {remainingSlots === 0 
                            ? "Maximum of 4 images reached" 
                            : isDraggingOver 
                              ? "Drop images to upload" 
                              : "Upload or drag project images"}
                        </span>
                      </label>

                      <p className="text-[11px] text-zinc-500">
                        {existingImages.length} saved · {selectedFiles.length} new · {remainingSlots} slots left
                      </p>

                      {(existingImages.length > 0 || selectedFiles.length > 0) && (
                        <div className="mt-2">
                          <p className="mb-2 text-[10px] text-zinc-400 italic">Tip: Drag images to reorder</p>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, index)}
                          >
                            <SortableContext
                              items={sortableItems}
                              strategy={rectSortingStrategy}
                            >
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {(project.imageOrder || []).map((id, itemIndex) => {
                                  if (id.startsWith("file:")) {
                                    const file = selectedFiles.find(f => `file:${getFileSignature(f)}` === id);
                                    if (!file) return null;
                                    const fileIndex = selectedFiles.indexOf(file);
                                    return (
                                      <SortableImageItem key={id} id={id}>
                                        <LocalImagePreview
                                          file={file}
                                          onRemove={() => {
                                            const next = selectedFiles.filter((_, i) => i !== fileIndex);
                                            updateProjectImages?.(index, next, "replace");
                                          }}
                                        />
                                      </SortableImageItem>
                                    );
                                  } else {
                                    const imageUrl = id;
                                    const imageIndex = existingImages.indexOf(imageUrl);
                                    if (imageIndex === -1) return null;
                                    return (
                                      <SortableImageItem key={id} id={id}>
                                        <UploadedImagePreview
                                          imageUrl={imageUrl}
                                          imageIndex={imageIndex}
                                          onRemove={() => removeExistingProjectImage?.(index, imageIndex)}
                                        />
                                      </SortableImageItem>
                                    );
                                  }
                                })}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Main Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateProject(index, "mainImageFile", event.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Secondary Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateProject(index, "secondaryImageFile", event.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Tertiary Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateProject(index, "tertiaryImageFile", event.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
