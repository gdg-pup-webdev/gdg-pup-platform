import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export async function getSpotlight() {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_showcase.spotlight.GET,
    {}
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  return null;
}
