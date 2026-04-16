import { useCallEndpointWithToken as callEndpoint, CallEndpointType } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { LearningResourcesException } from "../types";
import { configs } from "@/lib/constants/configs"; 

export async function deleteLearningResource(callEndpoint: CallEndpointType, id: string) {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.learning_resources.learningResourceId.DELETE,
      {
        params: { learningResourceId: id },
      }
    );

    if (result.status === 200 && result.body) {
      return result.body;
    }

    throw new LearningResourcesException(
      "Failed to delete learning resource",
      "DELETE_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof LearningResourcesException) throw error;
    throw new LearningResourcesException(
      "An unexpected error occurred while deleting learning resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
