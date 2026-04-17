import { useQuery } from "@tanstack/react-query";
import { LearningResourcesException, LearningResourcesQueryParams } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useGetLearningResources(params: Partial<LearningResourcesQueryParams> = {}) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["learning-resources", params],
    queryFn: async () => {
      try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.learning_resources.GET,
      {
        query: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          search: params.search,
          teamId: params.teamId,
          teamName: params.teamName,
          eventId: params.eventId,
        },
      }
    );

    if (result.status === 200 && result.body) {
      return result.body;
    }

    throw new LearningResourcesException(
      "Failed to fetch learning resources",
      "FETCH_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof LearningResourcesException) throw error;
    throw new LearningResourcesException(
      "An unexpected error occurred while fetching learning resources",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
    },
  });
}
