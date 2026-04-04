import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export function useGetMemberProjectsRequest() {
  const callEndpoint = useFetchApi();

  return async function getMemberProjects(pageNumber = 1, pageSize = 10) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.GET,
    {
      query: { pageNumber, pageSize },
    }
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  throw new Error("Failed to fetch member projects");
}
}
