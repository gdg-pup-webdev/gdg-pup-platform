import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetBevyEvents = (pageNumber = 1, pageSize = 10) => {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["bevy-events", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(configs.nexusApiBaseUrl, contract.api.v1.gdg_scraped_events.GET, {
        query: { pageNumber, pageSize },
      });

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
