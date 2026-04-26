import { useMutation, useQueryClient } from "@tanstack/react-query";  
import {
  CreateLearningResourceDTO,
  LearningResourcesException,
} from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";

export function useCreateLearningResource() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      thumbnail,
    }: {
      data: CreateLearningResourceDTO;
      thumbnail?: File;
    }) => {
      try {
        const result = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.learning_resources.POST,
          {
            body: { data: data },
            files: { thumbnailImage: thumbnail },
          },
        );

        if (result.status === 200 && result.body) {
          return result.body;
        }

        throw new LearningResourcesException(
          "Failed to create learning resource",
          "CREATE_ERROR",
          `Received status ${result.status}`,
        );
      } catch (error) {
        if (error instanceof LearningResourcesException) throw error;
        throw new LearningResourcesException(
          "An unexpected error occurred while creating learning resource",
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
