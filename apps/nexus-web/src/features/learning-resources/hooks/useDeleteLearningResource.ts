import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts"; 
import { LearningResourcesException } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useDeleteLearningResource() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const result = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.learning_resources.learningResourceId.DELETE,
          {
            params: { learningResourceId: id },
          },
        );

        if (result.status === 200 && result.body) {
          return result.body;
        }

        throw new LearningResourcesException(
          "Failed to delete learning resource",
          "DELETE_ERROR",
          `Received status ${result.status}`,
        );
      } catch (error) {
        if (error instanceof LearningResourcesException) throw error;
        throw new LearningResourcesException(
          "An unexpected error occurred while deleting learning resource",
          "SERVER_ERROR",
          error instanceof Error ? error.message : String(error),
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
