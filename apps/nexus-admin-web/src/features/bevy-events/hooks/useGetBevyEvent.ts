import { useQuery } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useFetchApi } from "@/hooks/useFetchApi";

export const useGetBevyEvent = (gdgId: string) => {
  const callEndpoint = useFetchApi();
  return useQuery({
    queryKey: ["bevy-event", gdgId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdg_scraped_events.gdg_id.GET,
        {
          params: { gdg_id: gdgId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!gdgId,
  });
};
