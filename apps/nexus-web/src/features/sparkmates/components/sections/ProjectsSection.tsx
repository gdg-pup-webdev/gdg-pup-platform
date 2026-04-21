import { Button, Text, Modal } from "@packages/spark-ui";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableProjectCardItem } from "../SparkmatesOwnerView/components/SortableProjectCardItem";
import { addIcon } from "../SparkmatesOwnerView/icons/addIcon";
import { UserProfile } from "@/features/sparkmates";
import { useMemberProjects } from "@/features/sparkmates/hooks/useMemberProjects";
import { ProjectsManager } from "@/features/onboarding/components/ProjectsManager";
import { ProjectFormState } from "@/features/onboarding/types";
import { ProjectDeleteConfirmDialog } from "@/features/sparkmates/components/ProjectDeleteConfirmDialog";
import { toast } from "react-toastify";
import { GdgLoader } from "@/components/ui/loader";

const MAX_PROJECT_IMAGES = 4;
const PROJECTS_PER_PAGE = 4;

const createEmptyProject = (): ProjectFormState => ({
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  projectLink: "",
  imageFiles: [],
  imageUrls: [],
  originalImageUrls: [],
  mainImageFile: null,
  mainImageUrl: null,
  secondaryImageFile: null,
  secondaryImageUrl: null,
  tertiaryImageFile: null,
  tertiaryImageUrl: null,
});

const toProjectFormState = (project: any): ProjectFormState => {
  const images = getProjectImages(project);

  return {
    id: project.id,
    title: project.title ?? "",
    startDate: project.startDate ? project.startDate.slice(0, 10) : "",
    endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    description: project.description ?? "",
    projectLink: project.projectLink ?? "",
    imageFiles: [],
    imageUrls: [...images],
    originalImageUrls: [...images],
    mainImageFile: null,
    mainImageUrl: images[0] || null,
    secondaryImageFile: null,
    secondaryImageUrl: images[1] || null,
    tertiaryImageFile: null,
    tertiaryImageUrl: images[2] || null,
  };
};

const toImageUrl = (value: unknown): string | null => {
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
};

const normalizeImageList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .map((entry) => toImageUrl(entry))
    .filter((entry): entry is string => Boolean(entry));

  return [...new Set(normalized)];
};

const getProjectImages = (project: any): string[] => {
  const images = normalizeImageList(project?.images);
  if (images.length > 0) {
    return images;
  }

  const imageUrls = normalizeImageList(project?.imageUrls);
  if (imageUrls.length > 0) {
    return imageUrls;
  }

  const snakeCaseImageUrls = normalizeImageList(project?.image_urls);
  if (snakeCaseImageUrls.length > 0) {
    return snakeCaseImageUrls;
  }

  return [
    project?.mainImageUrl,
    project?.secondaryImageUrl,
    project?.tertiaryImageUrl,
    project?.main_image_url,
    project?.secondary_image_url,
    project?.tertiary_image_url,
  ]
    .map((entry) => toImageUrl(entry))
    .filter((entry): entry is string => Boolean(entry));
};

const getFileSignature = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${file.type}`;

const dedupeFiles = (files: File[]): File[] => {
  const seen = new Set<string>();
  const unique: File[] = [];

  for (const file of files) {
    const signature = getFileSignature(file);
    if (seen.has(signature)) {
      continue;
    }
    seen.add(signature);
    unique.push(file);
  }

  return unique;
};

const areSameOrder = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
};

export const ProjectsSection = ({ profile, readOnly }: { profile: UserProfile; readOnly?: boolean }) => {
  const {
    projectsQuery,
    createProject,
    updateProject,
    deleteProject,
    addProjectImage,
    deleteProjectImage,
    reorderProjects,
  } = useMemberProjects(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormState>(createEmptyProject());
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [orderedProjectIds, setOrderedProjectIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleUpdateProject = (index: number, field: keyof Omit<ProjectFormState, "id">, value: string | File | null) => {
    if (index !== 0) {
      return;
    }

    setEditingProject((prev) => {
      const next = { ...prev };

      if (field === "mainImageFile") {
        next.mainImageFile = value as File | null;
      } else if (field === "secondaryImageFile") {
        next.secondaryImageFile = value as File | null;
      } else if (field === "tertiaryImageFile") {
        next.tertiaryImageFile = value as File | null;
      } else {
        (next as any)[field] = value;
      }

      return next;
    });
  };

  const handleUpdateProjectImages = (
    index: number,
    files: File[],
    mode: "append" | "replace" = "append",
  ) => {
    if (index !== 0) {
      return;
    }

    setEditingProject((prev) => {
      const current = prev.imageFiles || [];
      const baseImages = prev.imageUrls || [];
      const maxNewUploads = Math.max(0, MAX_PROJECT_IMAGES - baseImages.length);
      let nextImageFiles: File[];

      if (mode === "append") {
        nextImageFiles = dedupeFiles([...current, ...files]).slice(0, maxNewUploads);
      } else {
        nextImageFiles = dedupeFiles(files).slice(0, maxNewUploads);
      }

      return {
        ...prev,
        imageFiles: nextImageFiles,
      };
    });
  };

  const handleRemoveExistingProjectImage = (projectIndex: number, imageIndex: number) => {
    if (projectIndex !== 0) {
      return;
    }

    setEditingProject((prev) => {
      const existing = prev.imageUrls || [];
      if (imageIndex < 0 || imageIndex >= existing.length) {
        return prev;
      }

      return {
        ...prev,
        imageUrls: existing.filter((_, currentIndex) => currentIndex !== imageIndex),
      };
    });
  };

  const getRemovedImageIndices = (original: string[], desired: string[]): number[] => {
    const desiredCounts = new Map<string, number>();
    for (const imageUrl of desired) {
      desiredCounts.set(imageUrl, (desiredCounts.get(imageUrl) || 0) + 1);
    }

    const runningCounts = new Map<string, number>();
    const removedIndices: number[] = [];

    for (let index = 0; index < original.length; index += 1) {
      const imageUrl = original[index];
      const seenCount = (runningCounts.get(imageUrl) || 0) + 1;
      runningCounts.set(imageUrl, seenCount);

      if (seenCount > (desiredCounts.get(imageUrl) || 0)) {
        removedIndices.push(index);
      }
    }

    return removedIndices;
  };

  const handleOpenAddProjectModal = () => {
    setIsDeleteConfirmOpen(false);
    setEditingProject(createEmptyProject());
    setIsEditModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: any) => {
    setIsDeleteConfirmOpen(false);
    setEditingProject(toProjectFormState(project));
    setIsEditModalOpen(true);
  };

  const handleDeleteCurrentProject = () => {
    if (!editingProject.id) {
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleDirectDeleteProject = (project: any) => {
    setIsEditModalOpen(false);
    setEditingProject(toProjectFormState(project));
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteCurrentProject = async () => {
    if (!editingProject.id) {
      return;
    }

    setIsSavingProject(true);

    try {
      await deleteProject.mutateAsync(editingProject.id);
      setIsDeleteConfirmOpen(false);
      setIsEditModalOpen(false);
      setEditingProject(createEmptyProject());
      void projectsQuery.refetch();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleSave = async () => {
    if (isSavingProject) {
      return;
    }

    const title = editingProject.title.trim();
    const description = editingProject.description.trim();
    if (!title || !description || !editingProject.startDate) {
      toast.error("Please complete title, description, and start date before saving.");
      return;
    }

    setIsSavingProject(true);

    try {
      const existingImages = editingProject.imageUrls || [];
      const pendingImageFiles = dedupeFiles(editingProject.imageFiles || []);

      const projectPayload: Omit<ProjectFormState, "id"> = {
        ...editingProject,
        title,
        description,
        imageFiles: [],
        mainImageFile: null,
        secondaryImageFile: null,
        tertiaryImageFile: null,
      };

      if (editingProject.id) {
        const originalImages = editingProject.originalImageUrls || [];
        const removedIndices = getRemovedImageIndices(originalImages, existingImages).sort((a, b) => b - a);

        for (const imageIndex of removedIndices) {
          await deleteProjectImage.mutateAsync({ id: editingProject.id, imageIndex });
        }

        const remainingSlots = Math.max(0, MAX_PROJECT_IMAGES - existingImages.length);
        if (pendingImageFiles.length > remainingSlots) {
          throw new Error(
            `Project "${title}" exceeds the ${MAX_PROJECT_IMAGES}-image limit. Remove some existing images first.`,
          );
        }

        await updateProject.mutateAsync({ id: editingProject.id, data: projectPayload });

        for (const image of pendingImageFiles) {
          await addProjectImage.mutateAsync({ id: editingProject.id, image });
        }
      } else {
        if (pendingImageFiles.length > MAX_PROJECT_IMAGES) {
          throw new Error(`Project "${title}" exceeds the ${MAX_PROJECT_IMAGES}-image limit.`);
        }

        const created = await createProject.mutateAsync(projectPayload);
        const createdProjectId = (created as { id?: string } | undefined)?.id;

        if (!createdProjectId) {
          throw new Error("Failed to resolve the newly created project ID.");
        }

        for (const image of pendingImageFiles) {
          await addProjectImage.mutateAsync({ id: createdProjectId, image });
        }
      }

      setIsEditModalOpen(false);
      setEditingProject(createEmptyProject());
      await projectsQuery.refetch();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save projects");
    } finally {
      setIsSavingProject(false);
    }
  };

  const projectList = projectsQuery.data || [];

  const projectIdsFromQuery = useMemo(
    () => projectList.map((project: any) => String(project.id)),
    [projectList],
  );

  useEffect(() => {
    setOrderedProjectIds((previousIds) => {
      if (projectIdsFromQuery.length === 0) {
        return previousIds.length === 0 ? previousIds : [];
      }

      if (previousIds.length === 0) {
        return projectIdsFromQuery;
      }

      const incomingIdSet = new Set(projectIdsFromQuery);
      const retainedIds = previousIds.filter((id) => incomingIdSet.has(id));
      const appendedIds = projectIdsFromQuery.filter((id) => !retainedIds.includes(id));
      const nextIds = [...retainedIds, ...appendedIds];

      return areSameOrder(previousIds, nextIds) ? previousIds : nextIds;
    });
  }, [projectIdsFromQuery]);

  const orderedProjectList = useMemo(() => {
    const projectsById = new Map(
      projectList.map((project: any) => [String(project.id), project]),
    );

    const effectiveProjectIds = orderedProjectIds.length > 0
      ? orderedProjectIds
      : projectIdsFromQuery;

    return effectiveProjectIds
      .map((id) => projectsById.get(id))
      .filter((project): project is any => Boolean(project));
  }, [orderedProjectIds, projectIdsFromQuery, projectList]);

  const effectiveProjectIds = orderedProjectIds.length > 0
    ? orderedProjectIds
    : projectIdsFromQuery;

  const totalPages = Math.max(1, Math.ceil(orderedProjectList.length / PROJECTS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedProjectList = useMemo(() => {
    const start = (page - 1) * PROJECTS_PER_PAGE;
    return orderedProjectList.slice(start, start + PROJECTS_PER_PAGE);
  }, [orderedProjectList, page]);

  const paginatedProjectIds = useMemo(
    () => paginatedProjectList.map((project: any) => String(project.id)),
    [paginatedProjectList],
  );

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let value = 1; value <= totalPages; value += 1) {
        pages.push(value);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let value = start; value <= end; value += 1) {
      pages.push(value);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  const handleProjectDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const fromIndex = effectiveProjectIds.indexOf(activeId);
    const toIndex = effectiveProjectIds.indexOf(overId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const nextOrder = arrayMove(effectiveProjectIds, fromIndex, toIndex);
    setOrderedProjectIds(nextOrder);

    void (async () => {
      try {
        await reorderProjects.mutateAsync({
          memberGdgId: profile.gdgId,
          fromIndex,
          toIndex,
        });
      } catch {
        const refreshed = await projectsQuery.refetch();
        const backendIds = (refreshed.data || []).map((project: any) => String(project.id));
        setOrderedProjectIds(backendIds);
      }
    })();
  };

  const isSaving =
    isSavingProject ||
    createProject.isPending ||
    updateProject.isPending ||
    deleteProject.isPending ||
    addProjectImage.isPending ||
    deleteProjectImage.isPending ||
    reorderProjects.isPending;

  const isImageMutationPending =
    addProjectImage.isPending || deleteProjectImage.isPending;

  const viewAllProjectsHref = readOnly
    ? `/sparkmates/${profile.gdgId}/projects`
    : "/sparkmates/me/projects";

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Projects
        </Text>
        <Link prefetch={false} href={viewAllProjectsHref}>
          <Button
            variant="default"
            size="sm"
            className="px-3 py-1 text-white"
            title="View All Projects"
            aria-label="View All Projects"
          >
            View All
          </Button>
        </Link>
      </div>
      <Text variant="body-sm" className="text-[#C1C7CD]">
        Feature your best works to highlight your skills.
      </Text>
      
      <div className="space-y-3.5">
        {projectsQuery.isLoading ? (
          <div className="inline-flex items-center gap-2 text-zinc-300">
            <GdgLoader size="xs" />
            <Text variant="body-sm" className="text-zinc-300">Loading projects...</Text>
          </div>
        ) : projectList.length > 0 ? (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleProjectDragEnd}
            >
              <SortableContext
                items={paginatedProjectIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3.5">
                  {paginatedProjectList.map((project: any) => (
                    <SortableProjectCardItem
                      key={project.id}
                      id={String(project.id)}
                      project={project}
                      projectHref={readOnly
                        ? `/sparkmates/${profile.gdgId}/projects/${project.id}`
                        : `/sparkmates/me/projects/${project.id}`}
                      onEdit={() => handleOpenEditProjectModal(project)}
                      onDelete={() => handleDirectDeleteProject(project)}
                      sortingDisabled={reorderProjects.isPending}
                      handleDisabled={reorderProjects.isPending}
                      readOnly={readOnly}
                      truncateDescription
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C1C7CD]"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>

                {pageNumbers.map((entry, index) =>
                  entry === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-sm text-[#8FA1C7]">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={`page-${entry}`}
                      variant={entry === page ? "colored" : "ghost"}
                      subVariant={entry === page ? "blue" : undefined}
                      size="sm"
                      className={entry === page ? "text-white" : "text-[#C1C7CD]"}
                      onClick={() => setPage(entry)}
                    >
                      {entry}
                    </Button>
                  ),
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C1C7CD]"
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {!readOnly && (
        <Button
          variant="dashed-outline"
          className="w-full"
          iconLeft={addIcon}
          title="Add New Projects"
          aria-label="Add New Projects"
          onClick={handleOpenAddProjectModal}
        >
          Add New Projects
        </Button>
      )}

      <Modal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (isSaving) {
            return;
          }
          if (!open) {
            setIsDeleteConfirmOpen(false);
          }
          setIsEditModalOpen(open);
        }}
        scrollBehavior="inside"
        size="md"
        className="bg-transparent border-none p-0 shadow-none! isolate"
      >
        <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/80 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-6">
          <div>
            <Text variant="heading-6" weight="bold" gradient="white-yellow">
              {editingProject.id ? "Edit Project" : "Add Project"}
            </Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              {editingProject.id
                ? "Update this project details and images."
                : "Create a new project and upload up to 4 images."}
            </Text>
          </div>
          
          <ProjectsManager
            projects={[editingProject]}
            updateProject={handleUpdateProject}
            addProject={() => {}}
            removeProject={() => {}}
            singleProjectMode
            imageInputMode="list"
            updateProjectImages={handleUpdateProjectImages}
            removeExistingProjectImage={handleRemoveExistingProjectImage}
          />

          {isImageMutationPending && (
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-[#E5E5E5]">
              <GdgLoader size="xs" />
              <span>Saving project images...</span>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            {editingProject.id && (
              <Button
                variant="colored"
                subVariant="red"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteCurrentProject}
                disabled={isSaving}
              >
                Delete Project
              </Button>
            )}
            <Button variant="colored" subVariant="blue" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <GdgLoader size="xs" />
                  Saving...
                </span>
              ) : editingProject.id ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </div>
        </div>
      </Modal>

      <ProjectDeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        projectTitle={editingProject.title?.trim() || "this project"}
        onConfirm={handleConfirmDeleteCurrentProject}
        isPending={isSaving}
      />
    </section>
  );
};
