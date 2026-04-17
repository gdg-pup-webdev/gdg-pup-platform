import { CallEndpointType } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export async function deleteMemberProject(
  callEndpoint: CallEndpointType,id: string) {
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
