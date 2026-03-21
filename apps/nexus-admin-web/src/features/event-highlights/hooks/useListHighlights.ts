import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useListHighlights = (pageNumber = 1, pageSize = 10, eventId?: string) => {
  return useQuery({
    queryKey: ["event-highlights", "list", pageNumber, pageSize, eventId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.event_highlights.GET,
        {
          query: { pageNumber, pageSize, eventId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
