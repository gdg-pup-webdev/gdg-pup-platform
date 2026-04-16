import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useSearchMember = (q: string, limit =10) => {
  return useQuery({
    queryKey: ["members", "search", q, limit],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.GET,
        {
          query: { search: q, pageNumber: 1, pageSize: limit },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: q.length >= 2, // Only search if query is at least 2 characters
  });
};
