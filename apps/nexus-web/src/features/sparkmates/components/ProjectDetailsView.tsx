"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, X } from "lucide-react";
import { Button, Modal, Text } from "@packages/spark-ui";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";
import { getMemberProjectById } from "@/features/sparkmates/api/memberProjects";
import { useMemberProjects } from "@/features/sparkmates/hooks/useMemberProjects";
import { ProjectsManager } from "@/features/onboarding/components/ProjectsManager";
import { ProjectFormState } from "@/features/onboarding/types";
import { viewIcon } from "@/features/sparkmates/components/SparkmatesOwnerView/icons/viewIcon";
import { ProjectDeleteConfirmDialog } from "@/features/sparkmates/components/ProjectDeleteConfirmDialog";
import { SparkmatesBrandedErrorScreen } from "@/features/sparkmates/components/SparkmatesBrandedErrorScreen";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GdgLoader } from "@/components/ui/loader";

interface ProjectDetailsViewProps {
  projectId: string;
  backHref: string;
  expectedMemberGdgId?: string;
  ctaLabel: string;
  editable?: boolean;
}

const MAX_PROJECT_IMAGES = 4;
const DESCRIPTION_PREVIEW_LIMIT = 420;

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

const formatDate = (raw: string | null | undefined): string => {
  if (!raw) {
    return "";
  }

  const parsedDate = new Date(raw);
  if (Number.isNaN(parsedDate.getTime())) {
    return raw;
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const toImageSrc = (value: string | null | undefined): string => {
  if (!value) {
    return ASSETS.PROFILE.DEFAULT_AVATAR;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("//")) {
    return `${window.location.protocol}${value}`;
  }

  return value.startsWith("/") ? value : `/${value}`;
};

const toProjectLinkHref = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `${window.location.protocol}${trimmed}`;
  }

  return `https://${trimmed}`;
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

const toProjectFormState = (project: {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
  projectLink?: string | null;
  images: string[];
}): ProjectFormState => {
  const images = (project.images || []).filter(Boolean);

  return {
    id: project.id,
    title: project.title || "",
    startDate: project.startDate ? project.startDate.slice(0, 10) : "",
    endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    description: project.description || "",
    projectLink: project.projectLink || "",
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

const renderImageTile = (
  imageUrl: string,
  title: string,
  index: number,
  onSelect: (index: number) => void,
  className = "",
) => (
  <button
    key={`${imageUrl}-${index}`}
    type="button"
    onClick={() => onSelect(index)}
    className={`relative overflow-hidden rounded-lg bg-white/5 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57CAFF]/70 ${className}`}
  >
    <Image
      src={toImageSrc(imageUrl)}
      alt={`${title} preview ${index + 1}`}
      fill
      className="object-cover"
      onError={(e) => {
        const parent = (e.currentTarget as HTMLElement).parentElement;
        if (parent) {
          parent.style.display = 'none';
        }
      }}
    />
  </button>
);

const renderProjectImageGrid = (
  images: string[],
  title: string,
  onSelect: (index: number) => void,
) => {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="mx-auto mt-6 w-full max-w-md">
        {renderImageTile(images[0], title, 0, onSelect, "aspect-[4/3]")}
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((imageUrl, index) => renderImageTile(imageUrl, title, index, onSelect, "aspect-square"))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
        {images.slice(0, 2).map((imageUrl, index) =>
          renderImageTile(imageUrl, title, index, onSelect, "aspect-square"),
        )}
        <div className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.375rem)]">
          {renderImageTile(images[2], title, 2, onSelect, "aspect-square")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-3">
      {images.slice(0, 4).map((imageUrl, index) => renderImageTile(imageUrl, title, index, onSelect, "aspect-square"))}
    </div>
  );
};

export const ProjectDetailsView = ({
  projectId,
  backHref,
  expectedMemberGdgId,
  ctaLabel,
  editable = false,
}: ProjectDetailsViewProps) => {
  const router = useRouter();
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormState>(createEmptyProject());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["memberProject", projectId],
    queryFn: () => getMemberProjectById(projectId),
    enabled: Boolean(projectId),
  });

  const {
    updateProject,
    deleteProject,
    addProjectImage,
    deleteProjectImage,
  } = useMemberProjects(project?.memberGdgId);

  const closeLightbox = () => {
    setIsLightboxVisible(false);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setLightboxImageIndex(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsPanning(false);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    if (lightboxImageIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxImageIndex]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [projectId]);

  if (isLoading) {
    return <LoadingScreen message="Loading project..." />;
  }

  if (isError || !project) {
    const message = error instanceof Error ? error.message : "Unable to load project details.";

    return (
      <SparkmatesBrandedErrorScreen
        title="Unable to load project"
        message={message}
        backHref={backHref}
      />
    );
  }

  if (expectedMemberGdgId && project.memberGdgId !== expectedMemberGdgId) {
    return (
      <SparkmatesBrandedErrorScreen
        title="Project not found for this member"
        message="This project does not belong to the selected Sparkmate profile."
        backHref={backHref}
      />
    );
  }

  const visibleImages = (project.images || []).map((imageUrl) => imageUrl?.trim()).filter(Boolean).slice(0, 4);
  const memberName = project.member?.name?.trim() || project.memberGdgId;
  const memberAvatar = toImageSrc(project.member?.imageUrl || ASSETS.PROFILE.DEFAULT_AVATAR);
  const startDate = formatDate(project.startDate);
  const projectLinkHref = toProjectLinkHref(project.projectLink);
  const description = project.description?.trim() || "";
  const isLongDescription = description.length > DESCRIPTION_PREVIEW_LIMIT;
  const visibleDescription =
    isLongDescription && !isDescriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`
      : description;

  const activeImageUrl = lightboxImageIndex !== null ? visibleImages[lightboxImageIndex] : null;
  const activeImageNumber = (lightboxImageIndex ?? 0) + 1;

  const openLightbox = (index: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setLightboxImageIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);

    requestAnimationFrame(() => {
      setIsLightboxVisible(true);
    });
  };

  const updateZoom = (nextZoom: number) => {
    const clampedZoom = Math.max(1, Math.min(5, nextZoom));
    setZoom(clampedZoom);
    if (clampedZoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    if (lightboxImageIndex === null) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.2 : 0.2;
    updateZoom(zoom + delta);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) {
      return;
    }

    setIsPanning(true);
    panStartRef.current = {
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || zoom <= 1) {
      return;
    }

    setPan({
      x: event.clientX - panStartRef.current.x,
      y: event.clientY - panStartRef.current.y,
    });
  };

  const handlePointerUp = () => {
    setIsPanning(false);
  };

  const handleOpenEditModal = () => {
    setIsDeleteConfirmOpen(false);
    setEditingProject(toProjectFormState(project));
    setIsEditModalOpen(true);
  };

  const handleUpdateProjectField = (
    index: number,
    field: keyof Omit<ProjectFormState, "id">,
    value: string | File | null,
  ) => {
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
        (next as Record<string, unknown>)[field] = value;
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

  const handleSaveProject = async () => {
    if (isSavingProject || !editingProject.id) {
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

      const payload: Omit<ProjectFormState, "id"> = {
        ...editingProject,
        title,
        description,
        imageFiles: [],
        mainImageFile: null,
        secondaryImageFile: null,
        tertiaryImageFile: null,
      };

      await updateProject.mutateAsync({ id: editingProject.id, data: payload });

      for (const image of pendingImageFiles) {
        await addProjectImage.mutateAsync({ id: editingProject.id, image });
      }

      setIsEditModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = () => {
    if (!editingProject.id) {
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteProject = async () => {
    if (isSavingProject || !editingProject.id) {
      return;
    }

    setIsSavingProject(true);

    try {
      await deleteProject.mutateAsync(editingProject.id);
      setIsDeleteConfirmOpen(false);
      setIsEditModalOpen(false);
      router.push(backHref);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    } finally {
      setIsSavingProject(false);
    }
  };

  const isProjectMutationPending =
    isSavingProject ||
    updateProject.isPending ||
    deleteProject.isPending ||
    addProjectImage.isPending ||
    deleteProjectImage.isPending;

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={180}
      particleSpread={14}
      speed={0.028}
      particleBaseSize={75}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="min-h-screen overflow-x-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-24 sm:pt-36 text-white"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Link prefetch={false} href={backHref}>
            <Button variant="default" size="sm" iconLeft={<ChevronLeft size={14} />} className="px-3 py-1 text-white">
              Back
            </Button>
          </Link>

          {editable ? (
              <Button
                variant="colored"
                subVariant="blue"
                size="sm"
                className="px-3 py-1 text-white"
                onClick={handleOpenEditModal}
              >
                Edit Project
              </Button>
          ) : <span />}
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <Text variant="heading-4" weight="bold" className="text-center text-white">
            {project.title}
          </Text>
        </div>

        {renderProjectImageGrid(visibleImages, project.title, openLightbox)}

        <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-between gap-3 text-sm text-[#D7DCE2]">
          <div className="inline-flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/25">
              <Image src={memberAvatar} alt={memberName} fill className="object-cover" />
            </div>
            <span>{memberName}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <CalendarDays size={14} />
            <span>{startDate}</span>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.06)] p-4 sm:p-5">
          <Text variant="body-sm" className="whitespace-pre-line text-[#E5E5E5]">
            {visibleDescription}
          </Text>
          {isLongDescription ? (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded((previous) => !previous)}
              className="mt-2 text-sm font-semibold text-[#F9AB00] transition hover:text-[#FFD427]"
            >
              {isDescriptionExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>

        <div className="mx-auto mt-5 max-w-xl">
          {projectLinkHref ? (
            <a href={projectLinkHref} target="_blank" rel="noreferrer">
              <Button
                variant="default"
                size="sm"
                iconRight={viewIcon}
                className="w-full py-2 text-white"
              >
                {ctaLabel}
              </Button>
            </a>
          ) : (
            <Button
              variant="default"
              size="sm"
              iconRight={viewIcon}
              className="w-full py-2 text-white opacity-60"
              disabled
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>

      {activeImageUrl ? (
        <div
          className={`fixed inset-0 z-60 flex items-center justify-center px-3 py-6 transition-opacity duration-200 sm:px-6 ${isLightboxVisible ? "bg-black/85 opacity-100" : "bg-black/0 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <div className="relative flex h-full w-full max-w-6xl flex-col">
            <div className="mb-3 flex items-center justify-between gap-2 sm:hidden" onClick={(event) => event.stopPropagation()}>
              <div className="inline-flex items-center gap-2 text-sm text-white/85">
                <span>Image {activeImageNumber}</span>
                <span className="text-white/50">•</span>
                <span>Zoom {Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="px-2 py-1 text-white"
                  onClick={() => updateZoom(zoom - 0.2)}
                  disabled={zoom <= 1}
                >
                  -
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="px-2 py-1 text-white"
                  onClick={() => {
                    updateZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="px-2 py-1 text-white"
                  onClick={() => updateZoom(zoom + 0.2)}
                  disabled={zoom >= 5}
                >
                  +
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconLeft={<X size={14} />}
                  className="px-3 py-1 text-white"
                  onClick={closeLightbox}
                >
                  Close
                </Button>
              </div>
            </div>

            <div
              className={`relative flex-1 overflow-hidden rounded-xl border border-white/20 bg-black/30 transition-transform duration-200 ${isLightboxVisible ? "scale-100" : "scale-95"}`}
              onWheel={handleWheelZoom}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <div
                  className={`absolute inset-0 ${zoom > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 120ms ease-out",
                  }}
                >
                  <Image
                    src={toImageSrc(activeImageUrl)}
                    alt={`${project.title} preview ${activeImageNumber}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Modal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (isProjectMutationPending) {
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
                Edit Project
              </Text>
              <Text variant="body-sm" className="text-zinc-400 mt-1">
                Update this project details and images.
              </Text>
            </div>

            <ProjectsManager
              projects={[editingProject]}
              updateProject={handleUpdateProjectField}
              addProject={() => {}}
              removeProject={() => {}}
              singleProjectMode
              imageInputMode="list"
              updateProjectImages={handleUpdateProjectImages}
              removeExistingProjectImage={handleRemoveExistingProjectImage}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isProjectMutationPending}>
                Cancel
              </Button>
              <Button
                variant="colored"
                subVariant="red"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteProject}
                disabled={isProjectMutationPending}
              >
                Delete Project
              </Button>
              <Button
                variant="colored"
                subVariant="blue"
                onClick={handleSaveProject}
                disabled={isProjectMutationPending}
              >
                {isProjectMutationPending ? (
                  <span className="inline-flex items-center gap-2">
                    <GdgLoader size="xs" />
                    Saving...
                  </span>
                ) : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ProjectDeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        projectTitle={editingProject.title?.trim() || "this project"}
        onConfirm={handleConfirmDeleteProject}
        isPending={isProjectMutationPending}
      />
    </CosmosParticles>
  );
};
