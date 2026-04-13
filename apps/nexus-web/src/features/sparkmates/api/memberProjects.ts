import { contract } from "@packages/nexus-api-contracts";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { configs } from "@/configs/servers.config";
import { extractErrorMessage } from "@/lib/utils";
import type { ProjectFormState } from "@/features/onboarding/types"; // using the same type as Onboarding

export type MemberProjectRecord =
  contract.api.v1.member_projects.member.memberGdgId.GET.response[200]["data"][number];

export type MemberProjectsPaginatedResponse =
  contract.api.v1.member_projects.member.memberGdgId.GET.response[200];

export async function getMemberProjectsPaginated(
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
    return result.body;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to fetch projects");
}

export async function getMemberProjects(memberGdgId: string, token?: string) {
  const response = await getMemberProjectsPaginated(memberGdgId, {
    token,
    pageNumber: 1,
    pageSize: 10,
  });

  return response.data;
}

export async function createMemberProject(memberGdgId: string, project: Omit<ProjectFormState, "id">, token?: string) {
  const bodyData = {
    title: project.title.trim(),
    startDate: project.startDate,
    endDate: project.endDate || null,
    description: project.description.trim(),
    memberGdgId,
  };

  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.POST,
    {
      token: token ?? undefined,
      body: { data: bodyData },
      files: {
        mainImage: project.mainImageFile || undefined,
        secondaryImage: project.secondaryImageFile || undefined,
        tertiaryImage: project.tertiaryImageFile || undefined,
      },
    },
  );

  if (result.status === 201 && result.body) {
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to create project");
}

export async function updateMemberProject(projectId: string, project: Omit<ProjectFormState, "id">, token?: string) {
  const bodyData = {
    title: project.title.trim(),
    startDate: project.startDate,
    endDate: project.endDate || null,
    description: project.description.trim(),
  };

  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.PATCH,
    {
      token: token ?? undefined,
      params: { id: projectId },
      body: { data: bodyData },
      files: {
        mainImage: project.mainImageFile || undefined,
        secondaryImage: project.secondaryImageFile || undefined,
        tertiaryImage: project.tertiaryImageFile || undefined,
      },
    },
  );

  if (result.status === 200 && result.body) {
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to update project");
}

export async function deleteMemberProject(projectId: string, token?: string) {
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

  throw new Error(extractErrorMessage(result.body) || "Failed to delete project");
}

export async function addMemberProjectImage(
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
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to add project image");
}

export async function deleteMemberProjectImage(
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
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to delete project image");
}

export async function reorderMemberProjectImages(
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
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to reorder project images");
}

export async function reorderMemberProjects(
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

  throw new Error(extractErrorMessage(result.body) || "Failed to reorder projects");
}
