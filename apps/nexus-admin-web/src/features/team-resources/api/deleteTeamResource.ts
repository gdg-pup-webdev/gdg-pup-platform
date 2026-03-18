/**
 * API function to delete a team resource
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts"; 
import { TeamResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

/**
 * Delete a team resource by its ID
 * 
 * @param id - The unique identifier of the team resource to delete
 * @returns Promise resolving to the deletion confirmation response
 * @throws TeamResourcesException if the request fails
 */
export async function deleteTeamResource(id: string)  {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.team_resources.teamResourceId.DELETE,
      {
        params: { teamResourceId: id },
      }
    );

    if (result.status == 200) {
      return result.body;
    }

    throw new TeamResourcesException(
      "Failed to delete team resource",
      "DELETE_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof TeamResourcesException) throw error;
    throw new TeamResourcesException(
      "An unexpected error occurred while deleting team resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
