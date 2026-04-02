import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export async function getMemberProjectsByGdgId(memberGdgId: string, pageNumber = 1, pageSize = 10) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.member.memberGdgId.GET,
    {
      params: { memberGdgId },
      query: { pageNumber, pageSize },
    }
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  throw new Error(`Failed to fetch member projects for GDG ID ${memberGdgId}`);
}
