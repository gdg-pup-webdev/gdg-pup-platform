import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/configs/servers.config";
import { extractErrorMessage } from "@/lib/utils";
import type { ProjectFormState } from "@/features/onboarding/types"; // using the same type as Onboarding
import { CallEndpointType } from "@/hooks/useFetchWithToken";

export type MemberProjectRecord =
  contract.api.v1.member_projects.member.memberGdgId.GET.response[200]["data"][number];

export type MemberProjectsPaginatedResponse =
  contract.api.v1.member_projects.member.memberGdgId.GET.response[200];

export type MemberProjectDetailResponse =
  contract.api.v1.member_projects.id.GET.response[200];

const toAbsoluteApiUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `${window.location.protocol}${trimmed}`;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${configs.nexusApiBaseUrl}${normalizedPath}`;
};

const normalizeProjectImages = (project: Record<string, unknown>): string[] => {
  const candidates = [
    project.images,
    project.imageUrls,
    project.image_urls,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const normalized = candidate
      .map((entry) => {
        if (typeof entry === "string") {
          return toAbsoluteApiUrl(entry);
        }

        if (entry && typeof entry === "object") {
          const nested =
            (entry as { imageUrl?: unknown }).imageUrl ??
            (entry as { image_url?: unknown }).image_url ??
            (entry as { url?: unknown }).url ??
            (entry as { publicUrl?: unknown }).publicUrl ??
            (entry as { previewUrl?: unknown }).previewUrl;

          if (typeof nested === "string") {
            return toAbsoluteApiUrl(nested);
          }
        }

        return "";
      })
      .filter((entry) => entry.length > 0);

    if (normalized.length > 0) {
      return [...new Set(normalized)];
    }
  }

  const singleFields = [
    project.mainImageUrl,
    project.secondaryImageUrl,
    project.tertiaryImageUrl,
    project.main_image_url,
    project.secondary_image_url,
    project.tertiary_image_url,
  ];

  return singleFields
    .map((entry) => (typeof entry === "string" ? toAbsoluteApiUrl(entry) : ""))
    .filter((entry) => entry.length > 0);
};

const normalizeMemberProjectRecord = (project: MemberProjectRecord): MemberProjectRecord => {
  const normalizedImages = normalizeProjectImages(project as unknown as Record<string, unknown>);
  return {
    ...project,
    images: normalizedImages,
  };
};

export async function getMemberProjectsPaginated(
  callEndpoint: CallEndpointType,
  memberGdgId: string,
  options?: {
    token?: string;
    pageNumber?: number;
    pageSize?: number;
  },
) {
  const pageNumber = options?.pageNumber ?? 1;
  const pageSize = options?.pageSize ?? 10;

  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.member.memberGdgId.GET,
    {
      token: options?.token ?? undefined,
      params: { memberGdgId },
      query: {
        pageNumber,
        pageSize,
      },
    },
  );

  if (result.status === 200 && result.body) {
    return {
      ...result.body,
      data: result.body.data.map((project) => normalizeMemberProjectRecord(project)),
    };
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to fetch projects",
  );
}

export async function getMemberProjects(
  callEndpoint: CallEndpointType,
  memberGdgId: string,
  token?: string,
) {
  const response = await getMemberProjectsPaginated(callEndpoint, memberGdgId, {
    token,
    pageNumber: 1,
    pageSize: 10,
  });

  return response.data;
}

export async function getMemberProjectById(projectId: string, token?: string) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.GET,
    {
      token: token ?? undefined,
      params: { id: projectId },
    },
  );

  if (result.status === 200 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to fetch project");
}

export async function createMemberProject(memberGdgId: string, project: Omit<ProjectFormState, "id">, token?: string) {
  const bodyData = {
    title: project.title.trim(),
    startDate: project.startDate,
    endDate: project.endDate || null,
    description: project.description.trim(),
    projectLink: project.projectLink.trim() || null,
    memberGdgId,
  };

  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.POST,
    {
      token: token ?? undefined,
      body: { data: bodyData },
    },
  );

  if (result.status === 201 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to create project",
  );
}

export async function updateMemberProject(
  callEndpoint: CallEndpointType,
  projectId: string,
  project: Omit<ProjectFormState, "id">,
  token?: string,
) {
  const bodyData = {
    title: project.title.trim(),
    startDate: project.startDate,
    endDate: project.endDate || null,
    description: project.description.trim(),
    projectLink: project.projectLink.trim() || null,
  };

  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.PATCH,
    {
      token: token ?? undefined,
      params: { id: projectId },
      body: { data: bodyData },
    },
  );

  if (result.status === 200 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to update project",
  );
}

export async function deleteMemberProject(
  callEndpoint: CallEndpointType,
  projectId: string,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.DELETE,
    {
      token: token ?? undefined,
      params: { id: projectId },
    },
  );

  if (result.status === 200) {
    return true;
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to delete project",
  );
}

export async function addMemberProjectImage(
  callEndpoint: CallEndpointType,
  projectId: string,
  image: File,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.images.POST,
    {
      token: token ?? undefined,
      params: { id: projectId },
      body: {},
      files: { image },
    },
  );

  if (result.status === 200 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to add project image",
  );
}

export async function deleteMemberProjectImage(
  callEndpoint: CallEndpointType,
  projectId: string,
  imageIndex: number,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.images.imageIndex.DELETE,
    {
      token: token ?? undefined,
      params: {
        id: projectId,
        imageIndex: String(imageIndex),
      },
    },
  );

  if (result.status === 200 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to delete project image",
  );
}

export async function reorderMemberProjectImages(
  callEndpoint: CallEndpointType,

  projectId: string,
  fromIndex: number,
  toIndex: number,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.images.reorder.PATCH,
    {
      token: token ?? undefined,
      params: { id: projectId },
      body: {
        data: {
          fromIndex,
          toIndex,
        },
      },
    },
  );

  if (result.status === 200 && result.body) {
    return normalizeMemberProjectRecord(result.body.data);
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to reorder project images",
  );
}

export async function reorderMemberProjects(
  callEndpoint: CallEndpointType,
  memberGdgId: string,
  fromIndex: number,
  toIndex: number,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.member.memberGdgId.reorder.PATCH,
    {
      token: token ?? undefined,
      params: { memberGdgId },
      body: {
        data: {
          fromIndex,
          toIndex,
        },
      },
    },
  );

  if (result.status === 200 && result.body) {
    return true;
  }

  throw new Error(
    extractErrorMessage(result.body) || "Failed to reorder projects",
  );
}
