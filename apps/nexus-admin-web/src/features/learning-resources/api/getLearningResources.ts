import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { LearningResourcesQueryParams, LearningResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

export async function getLearningResources(params: Partial<LearningResourcesQueryParams> = {}) {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.learning_resources.GET,
      {
        query: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          search: params.search,
          type: params.type,
          teamId: params.teamId,
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
}
