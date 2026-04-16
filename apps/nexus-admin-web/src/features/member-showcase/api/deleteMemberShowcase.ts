import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export async function deleteMemberShowcase(id: string) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_showcase.id.DELETE,
    {
      params: { id },
    }
  );

  if (result.status === 200) {
    return true;
  }
  throw new Error("Failed to delete member showcase");
}
