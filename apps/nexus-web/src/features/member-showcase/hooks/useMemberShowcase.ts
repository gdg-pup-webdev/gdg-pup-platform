import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useMemberShowcase(id: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcase", id],
    queryFn: async () => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.id.GET,
        {
          params: { id },
        },
      );
    },
    enabled: !!id,
  });
}
