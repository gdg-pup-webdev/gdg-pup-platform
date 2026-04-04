import { useQuery } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
export const useGetOneEvent = (eventId: string) => {
  const callEndpoint = useFetchApi();
  return useQuery({
    queryKey: ["events", "detail", eventId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.GET,
        {
          params: { eventId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!eventId,
  });
};
