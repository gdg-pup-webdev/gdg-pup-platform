import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useMemberShowcases(pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcases", pageNumber, pageSize],
    queryFn: async () => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.GET,
        {
          query: { pageNumber, pageSize },
        },
      );

      if (result.status === 200 && result.body) {
        return result.body;
      }
      throw new Error("Failed to fetch member showcases");
    },
  });
}
