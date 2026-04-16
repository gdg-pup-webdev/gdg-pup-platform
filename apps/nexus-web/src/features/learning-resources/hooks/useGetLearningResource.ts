import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";
import { LearningResourcesException } from "../types";

export function useGetLearningResource(id: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["learning-resources", id],
    queryFn: async () => {
      try {
        const result = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.learning_resources.learningResourceId.GET,
          {
            params: { learningResourceId: id },
          },
        );

        if (result.status === 200 && result.body) {
          return result.body;
        }

        throw new LearningResourcesException(
          "Failed to fetch learning resource",
          "FETCH_ERROR",
          `Received status ${result.status}`,
        );
      } catch (error) {
        if (error instanceof LearningResourcesException) throw error;
        throw new LearningResourcesException(
          "An unexpected error occurred while fetching learning resource",
          "SERVER_ERROR",
          error instanceof Error ? error.message : String(error),
        );
      }
    },
    enabled: !!id,
  });
}
