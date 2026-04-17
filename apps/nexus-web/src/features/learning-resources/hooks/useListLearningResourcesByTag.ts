import { useQuery } from "@tanstack/react-query";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useListLearningResourcesByTag(tag: string, pageNumber: number = 1, pageSize: number = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["learning-resources", "tag", tag, pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.learning_resources.tags.tag.GET,
        {
          params: { tag },
          query: { pageNumber, pageSize },
        }
      );

      if (res.status === 200) return res.body;
      throw new Error("Failed to fetch learning resources by tag");
    },
    enabled: !!tag,
  });
}
