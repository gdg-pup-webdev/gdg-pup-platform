/**
 * API function to update an existing team resource
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts"; 
import { UpdateTeamResourceDTO, TeamResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

/**
 * Update a team resource by ID
 * 
 * @param id - The ID of the team resource to update
 * @param data - The update payload
 * @param thumbnail - Optional new thumbnail image file
 * @returns Promise resolving to the updated team resource response
 * @throws TeamResourcesException if the request fails
 */
export async function updateTeamResource(
  id: string,
  data: UpdateTeamResourceDTO,
  thumbnail?: File
): Promise<any> {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.team_resources.teamResourceId.PATCH,
      {
        body: { data: data },
        files: { thumbnail_image: thumbnail },
        params: { teamResourceId: id },
      }
    );

    if (result.status == 200 && result.body) {
      return result.body;
    }

    throw new TeamResourcesException(
      "Failed to update team resource",
      "UPDATE_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof TeamResourcesException) throw error;
    throw new TeamResourcesException(
      "An unexpected error occurred while updating team resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
