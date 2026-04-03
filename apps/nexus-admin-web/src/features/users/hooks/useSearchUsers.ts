import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useSearchUsers = (q: string, limit = "10") => {
  return useQuery({
    queryKey: ["users", "search", q, limit],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.users.search.GET,
        {
          query: { q, limit },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: q.length >= 2, // Only search if query is at least 2 characters
  });
};
