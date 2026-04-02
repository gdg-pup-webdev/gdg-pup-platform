import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useListEvents = (pageNumber = 1, pageSize = 10, filters?: { type?: string; teamId?: string; teamName?: string; category?: string }) => {
  return useQuery({
    queryKey: ["events", "list", pageNumber, pageSize, filters],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.GET,
        {
          query: { 
            pageNumber, 
            pageSize,
            type: filters?.type,
            teamId: filters?.teamId,
            teamName: filters?.teamName,
            category: filters?.category
          },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};