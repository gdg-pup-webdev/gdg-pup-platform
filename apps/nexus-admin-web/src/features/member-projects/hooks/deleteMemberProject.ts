import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export function useDeleteMemberProjectRequest() {
  const callEndpoint = useFetchApi();

  return async function deleteMemberProject(id: string) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.DELETE,
    {
      params: { id },
    }
  );

  if (result.status === 200) {
    return true;
  }
  throw new Error(`Failed to delete member project with ID ${id}`);
}
}
