/**
 * API function to fetch a single team resource by ID
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts"; 
import { TeamResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

/**
 * Fetch a single team resource by its ID
 * 
 * @param id - The unique identifier of the team resource
 * @returns Promise resolving to the team resource response
 * @throws TeamResourcesException if the request fails or resource not found
 */
export async function getTeamResourceById(id: string) {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.team_resources.teamResourceId.GET,
      {
        params: { teamResourceId: id },
      }
    );

    if (result.status == 200 && result.body) {
      return result.body;
    }

    throw new TeamResourcesException(
      "Failed to fetch team resource",
      "FETCH_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof TeamResourcesException) throw error;
    throw new TeamResourcesException(
      "An unexpected error occurred while fetching team resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
