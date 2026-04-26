import { useCallEndpointWithToken as callEndpoint, CallEndpointType } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { UpdateLearningResourceDTO, LearningResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

export async function updateLearningResource(
  callEndpoint: CallEndpointType,
  id: string,
  data: UpdateLearningResourceDTO,
  thumbnail?: File
) {
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
}
