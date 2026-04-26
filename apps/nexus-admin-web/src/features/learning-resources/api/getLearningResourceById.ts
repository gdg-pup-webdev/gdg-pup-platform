import { useCallEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { LearningResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";
import { CallEndpointType } from '../../../hooks/useFetchWithToken';

export async function getLearningResourceById(callEndpoint : CallEndpointType, id: string) {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.learning_resources.learningResourceId.GET,
      {
        params: { learningResourceId: id },
      }
    );

    if (result.status === 200 && result.body) {
      return result.body;
    }

    throw new LearningResourcesException(
      "Failed to fetch learning resource",
      "FETCH_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof LearningResourcesException) throw error;
    throw new LearningResourcesException(
      "An unexpected error occurred while fetching learning resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
