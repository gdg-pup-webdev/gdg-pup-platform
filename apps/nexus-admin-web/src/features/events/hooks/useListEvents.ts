import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useListEvents = (pageNumber = 1, pageSize = 10, filters?: { type?: string; teamId?: string; teamName?: string; category?: string; year?: number }) => {
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
            category: filters?.category,
            year: filters?.year
          },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};