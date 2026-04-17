import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useSpotlight() {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcase", "spotlight"],
    queryFn: async () => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.spotlight.GET,
        {},
      );

      if (result.status === 200 && result.body) {
        return result.body;
      }
      return null;
    },
  });
}
