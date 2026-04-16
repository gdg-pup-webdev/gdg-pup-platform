import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { CreateMemberProjectDTO } from "../types";

export function useCreateMemberProjectRequest() {
  const callEndpoint = useFetchApi();

  return async function createMemberProject(
  data: CreateMemberProjectDTO,
  files?: {
    mainImage?: File;
    secondaryImage?: File;
    tertiaryImage?: File;
  }
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.POST,
    {
      body: { data },
    }
  );

  if (result.status === 201 && result.body) {
    return result.body;
  }
  throw new Error("Failed to create member project");
}
}
