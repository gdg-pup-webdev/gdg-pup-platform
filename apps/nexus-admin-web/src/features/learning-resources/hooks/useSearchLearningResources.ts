import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export function useSearchLearningResources(query: string, limit: number = 10) {
  return useQuery({
    queryKey: ["learning-resources", "search", query, limit],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.learning_resources.search.GET,
        {
          query: { q: query, limit },
        }
      );

      if (res.status === 200) return res.body.data;
      throw new Error("Failed to search learning resources");
    },
    enabled: query.length >= 2,
  });
}
