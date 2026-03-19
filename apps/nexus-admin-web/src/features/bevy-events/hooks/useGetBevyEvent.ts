import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export const useGetBevyEvent = (gdgId: string) => {
  return useQuery({
    queryKey: ["bevy-event", gdgId],
    queryFn: async () => {
      const res = await callEndpoint(configs.nexusApiBaseUrl, contract.api.v1.gdg_scraped_events.gdg_id.GET, {
        params: { gdg_id: gdgId },
      });

      if (res.status === 200) return res.body;

      throw new Error(res.body.message);
    },
    enabled: !!gdgId,
  });
};
