import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { useAuthContext, STATUS } from "@/features/authentication/store/useAuthStore";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { LINKS } from "@/lib/constants/links";
import { FormState, ProjectFormState } from "../types";

const MAX_PROJECT_IMAGES = 4;

const initialState: FormState = {
  nickname: "",
  bio: "",
  department: "",
  yearLevel: "",
  program: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioWebsiteUrl: "",
  technicalSkills: "",
  learningInterests: "",
  toolsAndTechnologies: "",
  otherLinks: "",
  isPublic: null,
};

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

const getProjectImages = (project: {
  images?: string[];
  mainImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  tertiaryImageUrl?: string | null;
}): string[] => {
  if (Array.isArray(project.images)) {
    return project.images.filter((image): image is string => Boolean(image));
  }

  return [project.mainImageUrl, project.secondaryImageUrl, project.tertiaryImageUrl].filter(
    (image): image is string => Boolean(image),
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

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toDateInputValue = (value: string | null): string =>
  value ? value.slice(0, 10) : "";

export function useOnboardingForm(gdgId: string) {
  const router = useRouter();
  const { token, fetchMemberProfile } = useAuthContext();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPrefilling, setIsPrefilling] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [serverAvatarUrl, setServerAvatarUrl] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [projects, setProjects] = useState<ProjectFormState[]>([createEmptyProject()]);

  useEffect(() => {
    if (!token || !gdgId) return;

    let isCancelled = false;

    const prefill = async () => {
      try {
        const result = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.gdgmembers.gdgId.GET,
          {
            token: token ?? undefined,
            params: { gdgId },
          },
        );

        if (result.status !== 200) {
          throw new Error(extractErrorMessage(result.body));
        }

        const member = result.body.data;

        if (isCancelled) return;

        setServerAvatarUrl(member.avatarUrl);
        setForm((prev) => ({
          ...prev,
          nickname: member.displayName ?? "",
          bio: member.bio ?? "",
          department: member.department ?? "",
          yearLevel: member.yearLevel ? String(member.yearLevel) : "",
          program: member.program ?? "",
          githubUrl: member.githubUrl ?? "",
          linkedinUrl: member.linkedinUrl ?? "",
          portfolioWebsiteUrl: member.portfolioWebsiteUrl ?? "",
          technicalSkills: member.technicalSkills.join(", "),
          learningInterests: member.learningInterests.join(", "),
          toolsAndTechnologies: member.toolsAndTechnologies.join(", "),
          otherLinks: member.otherLinks.join(", "),
          isPublic: member.isPublic,
        }));

        const projectsResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.member_projects.member.memberGdgId.GET,
          {
            token: token ?? undefined,
            params: { memberGdgId: gdgId },
            query: {
              pageNumber: 1,
              pageSize: 100,
            },
          },
        );

        if (projectsResult.status === 200 && projectsResult.body.data.length > 0) {
          setProjects(
            projectsResult.body.data.map((project) => {
              const images = getProjectImages(project);

              return {
                id: project.id,
                title: project.title,
                startDate: toDateInputValue(project.startDate),
                endDate: toDateInputValue(project.endDate),
                description: project.description,
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
            }),
          );
        }
      } catch {
        if (!isCancelled) {
          toast.error("Unable to load your profile details.");
        }
      } finally {
        if (!isCancelled) {
          setIsPrefilling(false);
        }
      }
    };

    prefill();

    return () => {
      isCancelled = true;
    };
  }, [gdgId, token]);

  const updateField = (field: keyof FormState, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateProject = (index: number, field: keyof Omit<ProjectFormState, "id">, value: string | File | null) => {
    setProjects((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;

      if (field === "mainImageFile") {
        item.mainImageFile = value as File | null;
      } else if (field === "mainImageUrl") {
        item.mainImageUrl = value as string | null;
      } else if (field === "secondaryImageFile") {
        item.secondaryImageFile = value as File | null;
      } else if (field === "secondaryImageUrl") {
        item.secondaryImageUrl = value as string | null;
      } else if (field === "tertiaryImageFile") {
        item.tertiaryImageFile = value as File | null;
      } else if (field === "tertiaryImageUrl") {
        item.tertiaryImageUrl = value as string | null;
      } else {
        (item as any)[field] = value;
      }

      return next;
    });
  };

  const addProject = () => {
    setProjects((prev) => [...prev, createEmptyProject()]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => {
      if (prev.length === 1) return [createEmptyProject()];
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateProjectImages = (
    index: number,
    files: File[],
    mode: "append" | "replace" = "append",
  ) => {
    setProjects((prev) => {
      const next = [...prev];
      const item = next[index];

      if (!item) {
        return prev;
      }

      const current = item.imageFiles || [];
      const existingImages = item.imageUrls || [];
      const maxNewUploads = Math.max(0, MAX_PROJECT_IMAGES - existingImages.length);

      item.imageFiles = (
        mode === "append"
          ? dedupeFiles([...current, ...files])
          : dedupeFiles(files)
      ).slice(0, maxNewUploads);

      return next;
    });
  };

  const removeExistingProjectImage = (index: number, imageIndex: number) => {
    setProjects((prev) => {
      const next = [...prev];
      const item = next[index];

      if (!item) {
        return prev;
      }

      const existing = item.imageUrls || [];
      if (imageIndex < 0 || imageIndex >= existing.length) {
        return prev;
      }

      item.imageUrls = existing.filter((_, currentIndex) => currentIndex !== imageIndex);
      return next;
    });
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("You need to be signed in to save your profile.");
      return;
    }

    if (form.isPublic === null) {
      toast.error("Please select your profile visibility (Public or Private) before saving.");
      return;
    }

    setIsSaving(true);

    try {
      if (profileFile) {
        const imageResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.gdgmembers.gdgId.profile_image.POST,
          {
            token: token ?? undefined,
            params: { gdgId },
            files: {
              newProfile: profileFile,
            },
            body: {
              data: {},
            },
          },
        );

        if (imageResult.status !== 200) {
          throw new Error(extractErrorMessage(imageResult.body));
        }
      }

      const updateResult = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.PATCH,
        {
          token: token ?? undefined,
          params: { gdgId },
          body: {
            data: {
              displayName: form.nickname || null,
              bio: form.bio || null,
              department: form.department || null,
              yearLevel: form.yearLevel ? Number(form.yearLevel) : null,
              program: form.program || null,
              githubUrl: form.githubUrl || null,
              linkedinUrl: form.linkedinUrl || null,
              portfolioWebsiteUrl: form.portfolioWebsiteUrl || null,
              technicalSkills: parseCsv(form.technicalSkills),
              learningInterests: parseCsv(form.learningInterests),
              toolsAndTechnologies: parseCsv(form.toolsAndTechnologies),
              otherLinks: parseCsv(form.otherLinks),
              isOnboarded: true,
              isPublic: form.isPublic,
            },
          },
        },
      );

      if (updateResult.status !== 200) {
        throw new Error(extractErrorMessage(updateResult.body));
      }

      const validProjects = projects.filter((project) => project.title.trim() && project.description.trim() && project.startDate);

      for (const project of validProjects) {
        const existingImages = project.imageUrls || [];
        const pendingImageFiles = dedupeFiles(project.imageFiles || []);

        const bodyData = {
          title: project.title.trim(),
          startDate: project.startDate,
          endDate: project.endDate || null,
          description: project.description.trim(),
        };

        if (project.id) {
          const originalImages = project.originalImageUrls || [];
          const removedIndices = getRemovedImageIndices(originalImages, existingImages).sort((a, b) => b - a);

          for (const imageIndex of removedIndices) {
            const deleteImageResult = await callEndpoint(
              configs.nexusApiBaseUrl,
              contract.api.v1.member_projects.id.images.imageIndex.DELETE,
              {
                token: token ?? undefined,
                params: {
                  id: project.id,
                  imageIndex: String(imageIndex),
                },
              },
            );

            if (deleteImageResult.status !== 200) {
              throw new Error(extractErrorMessage(deleteImageResult.body));
            }
          }

          const remainingSlots = Math.max(0, MAX_PROJECT_IMAGES - existingImages.length);
          if (pendingImageFiles.length > remainingSlots) {
            throw new Error(
              `Project "${project.title.trim()}" exceeds the ${MAX_PROJECT_IMAGES}-image limit. Remove existing images first.`,
            );
          }

          const patchProjectResult = await callEndpoint(
            configs.nexusApiBaseUrl,
            contract.api.v1.member_projects.id.PATCH,
            {
              token: token ?? undefined,
              params: { id: project.id },
              body: { data: bodyData }, 
            },
          );

          if (patchProjectResult.status !== 200) {
            throw new Error(extractErrorMessage(patchProjectResult.body));
          }

          for (const image of pendingImageFiles) {
            const addImageResult = await callEndpoint(
              configs.nexusApiBaseUrl,
              contract.api.v1.member_projects.id.images.POST,
              {
                token: token ?? undefined,
                params: { id: project.id },
                body: {},
                files: { image },
              },
            );

            if (addImageResult.status !== 200) {
              throw new Error(extractErrorMessage(addImageResult.body));
            }
          }

          continue;
        }

        if (pendingImageFiles.length > MAX_PROJECT_IMAGES) {
          throw new Error(
            `Project "${project.title.trim()}" exceeds the ${MAX_PROJECT_IMAGES}-image limit.`,
          );
        }

        const createProjectResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.member_projects.POST,
          {
            token: token ?? undefined,
            body: {
              data: {
                ...bodyData,
                memberGdgId: gdgId,
              },
            },
          },
        );

        if (createProjectResult.status !== 201) {
          throw new Error(extractErrorMessage(createProjectResult.body));
        }

        const createdProjectId = createProjectResult.body?.data?.id;
        if (!createdProjectId) {
          throw new Error("Failed to resolve the newly created project ID.");
        }

        for (const image of pendingImageFiles) {
          const addImageResult = await callEndpoint(
            configs.nexusApiBaseUrl,
            contract.api.v1.member_projects.id.images.POST,
            {
              token: token ?? undefined,
              params: { id: createdProjectId },
              body: {},
              files: { image },
            },
          );

          if (addImageResult.status !== 200) {
            throw new Error(extractErrorMessage(addImageResult.body));
          }
        }
      }

      setIsSuccess(true);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    // Setting isPublic to false when skipping to mark as onboarded (private)
    try {
      await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.PATCH,
        {
          token: token ?? undefined,
          params: { gdgId },
          body: {
            data: {
              isOnboarded: true,
              isPublic: false,
            },
          },
        },
      );
      await fetchMemberProfile();
    } catch (error) {
      console.error("Failed to mark onboarding as completed during skip", error);
    }
    router.push(LINKS.sparkmates_me);
  };

  return {
    step,
    setStep,
    isPrefilling,
    isSaving,
    isSuccess,
    profileFile,
    setProfileFile,
    serverAvatarUrl,
    form,
    projects,
    updateField,
    updateProject,
    addProject,
    removeProject,
    updateProjectImages,
    removeExistingProjectImage,
    handleSave,
    handleSkip,
    fetchMemberProfile,
  };
}
