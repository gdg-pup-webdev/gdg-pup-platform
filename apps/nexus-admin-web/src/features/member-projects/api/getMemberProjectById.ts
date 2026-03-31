import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export async function getMemberProjectById(id: string) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.GET,
    {
      params: { id },
    }
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  throw new Error(`Failed to fetch member project with ID ${id}`);
}
