import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { markOnboardingCompleted } from "../utils/onboardingStorage";
import { FormState, ProjectFormState } from "../types";

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
};

const createEmptyProject = (): ProjectFormState => ({
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  mainImageFile: null,
  mainImageUrl: null,
});

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toDateInputValue = (value: string | null): string =>
  value ? value.slice(0, 10) : "";

export function useOnboardingForm(gdgId: string) {
  const router = useRouter();
  const { token } = useAuthContext();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPrefilling, setIsPrefilling] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
            token,
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
        }));

        const projectsResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.member_projects.member.memberGdgId.GET,
          {
            token,
            params: { memberGdgId: gdgId },
            query: {
              pageNumber: 1,
              pageSize: 3,
            },
          },
        );

        if (projectsResult.status === 200 && projectsResult.body.data.length > 0) {
          setProjects(
            projectsResult.body.data.map((project) => ({
              id: project.id,
              title: project.title,
              startDate: toDateInputValue(project.startDate),
              endDate: toDateInputValue(project.endDate),
              description: project.description,
              mainImageFile: null,
              mainImageUrl: project.mainImageUrl,
            })),
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

  const updateField = (field: keyof FormState, value: string) => {
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

  const handleSave = async () => {
    if (!token) {
      toast.error("You need to be signed in to save your profile.");
      return;
    }

    setIsSaving(true);

    try {
      if (profileFile) {
        const imageResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.gdgmembers.gdgId.profile_image.POST,
          {
            token,
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
          token,
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
              isPublic: true,
            },
          },
        },
      );

      if (updateResult.status !== 200) {
        throw new Error(extractErrorMessage(updateResult.body));
      }

      const validProjects = projects.filter((project) => project.title.trim() && project.description.trim() && project.startDate);

      for (const project of validProjects) {
        const bodyData = {
          title: project.title.trim(),
          startDate: project.startDate,
          endDate: project.endDate || null,
          description: project.description.trim(),
        };

        if (project.id) {
          const patchProjectResult = await callEndpoint(
            configs.nexusApiBaseUrl,
            contract.api.v1.member_projects.id.PATCH,
            {
              token,
              params: { id: project.id },
              body: { data: bodyData },
              files: {
                mainImage: project.mainImageFile || undefined,
                secondaryImage: undefined,
                tertiaryImage: undefined,
              },
            },
          );

          if (patchProjectResult.status !== 200) {
            throw new Error(extractErrorMessage(patchProjectResult.body));
          }
          continue;
        }

        const createProjectResult = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.member_projects.POST,
          {
            token,
            body: {
              data: {
                ...bodyData,
                memberGdgId: gdgId,
              },
            },
            files: {
              mainImage: project.mainImageFile || undefined,
              secondaryImage: undefined,
              tertiaryImage: undefined,
            },
          },
        );

        if (createProjectResult.status !== 201) {
          throw new Error(extractErrorMessage(createProjectResult.body));
        }
      }

      markOnboardingCompleted(gdgId);
      toast.success("Profile updated successfully.");
      router.push("/sparkmates/me");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    markOnboardingCompleted(gdgId);
    router.push("/");
  };

  return {
    step,
    setStep,
    isPrefilling,
    isSaving,
    profileFile,
    setProfileFile,
    serverAvatarUrl,
    form,
    projects,
    updateField,
    updateProject,
    addProject,
    removeProject,
    handleSave,
    handleSkip,
  };
}
