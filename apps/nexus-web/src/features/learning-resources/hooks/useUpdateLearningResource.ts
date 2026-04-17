import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LearningResourcesException, UpdateLearningResourceDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useUpdateLearningResource() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, thumbnail }: { id: string; data: UpdateLearningResourceDTO; thumbnail?: File }) =>
      {
         try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.learning_resources.learningResourceId.PATCH,
      {
        params: { learningResourceId: id },
        body: { data: data },
        files: { thumbnailImage: thumbnail },
      }
    );

    if (result.status === 200 && result.body) {
      return result.body;
    }

    throw new LearningResourcesException(
      "Failed to update learning resource",
      "UPDATE_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof LearningResourcesException) throw error;
    throw new LearningResourcesException(
      "An unexpected error occurred while updating learning resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
      },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
      queryClient.invalidateQueries({ queryKey: ["learning-resources", variables.id] });
    },
  });
}
