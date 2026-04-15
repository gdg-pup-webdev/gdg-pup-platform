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
import { SortableProjectCardItem } from "../components/SortableProjectCardItem";
import { addIcon } from "../icons/addIcon";
import { UserProfile } from "@/features/sparkmates";
import { useMemberProjects } from "@/features/sparkmates/hooks/useMemberProjects";
import { ProjectsManager } from "@/features/onboarding/components/ProjectsManager";
import { ProjectFormState } from "@/features/onboarding/types";
import { toast } from "react-toastify";

const MAX_PROJECT_IMAGES = 4;

const createEmptyProject = (): ProjectFormState => ({
  title: "",
  startDate: "",
  endDate: "",
  description: "",
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

const getProjectImages = (project: any): string[] => {
  if (Array.isArray(project?.images)) {
    return project.images.filter((image: unknown): image is string => typeof image === "string" && image.length > 0);
  }

  return [project?.mainImageUrl, project?.secondaryImageUrl, project?.tertiaryImageUrl].filter(
    (image): image is string => typeof image === "string" && image.length > 0,
  );
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

export const ProjectsSection = ({ profile }: { profile: UserProfile }) => {
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
  const [editingProject, setEditingProject] = useState<ProjectFormState>(createEmptyProject());
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [orderedProjectIds, setOrderedProjectIds] = useState<string[]>([]);

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
    setEditingProject(createEmptyProject());
    setIsEditModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: any) => {
    setEditingProject(toProjectFormState(project));
    setIsEditModalOpen(true);
  };

  const handleDeleteCurrentProject = async () => {
    if (!editingProject.id) {
      return;
    }

    const confirmed = confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setIsSavingProject(true);

    try {
      await deleteProject.mutateAsync(editingProject.id);
      setIsEditModalOpen(false);
      setEditingProject(createEmptyProject());
      await projectsQuery.refetch();
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

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Projects
        </Text>
        <div className="flex items-center gap-2">
          <Link prefetch={false} href="/sparkmates/me/projects">
            <Button
              variant="outline"
              size="sm"
              className="px-3 text-white border-white/20 hover:bg-white/10"
              title="View All Projects"
              aria-label="View All Projects"
            >
              View All
            </Button>
          </Link>
          <Button
            variant="dashed-outline"
            size="sm"
            className="px-3"
            title="Add Project"
            aria-label="Add Project"
            iconLeft={addIcon}
            onClick={handleOpenAddProjectModal}
          >
            Add Project
          </Button>
        </div>
      </div>
      <Text variant="body-sm" className="text-[#C1C7CD]">
        Feature your best works to highlight your skills.
      </Text>
      
      <div className="space-y-3.5">
        {projectsQuery.isLoading ? (
          <Text variant="body-sm" className="text-zinc-500">Loading projects...</Text>
        ) : projectList.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleProjectDragEnd}
          >
            <SortableContext
              items={effectiveProjectIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3.5">
                {orderedProjectList.map((project: any) => (
                  <SortableProjectCardItem
                    key={project.id}
                    id={String(project.id)}
                    project={project}
                    onEdit={() => handleOpenEditProjectModal(project)}
                    sortingDisabled={reorderProjects.isPending}
                    handleDisabled={reorderProjects.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center text-[#C1C7CD]">
            <Text variant="body-sm">No projects added yet.</Text>
          </div>
        )}
      </div>

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="md" className="bg-transparent border-none p-0 shadow-none! isolate">
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
          
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            {editingProject.id && (
              <Button
                variant="ghost"
                className="text-red-300 hover:text-red-200"
                onClick={handleDeleteCurrentProject}
                disabled={isSaving}
              >
                Delete Project
              </Button>
            )}
            <Button variant="colored" subVariant="blue" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editingProject.id ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </section>
  );
};
