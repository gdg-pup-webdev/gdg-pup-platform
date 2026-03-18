/**
 * API function to create a new team resource
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts"; 
import { CreateTeamResourceDTO, TeamResourcesException } from "../types";
import { configs } from "@/lib/constants/configs";

/**
 * Create a new team resource
 * 
 * @param data - The team resource data to create
 * @param thumbnail - Optional thumbnail image file
 * @returns Promise resolving to the created team resource response
 * @throws TeamResourcesException if the request fails
 */
export async function createTeamResource(
  data: CreateTeamResourceDTO,
  thumbnail?: File
) {
  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.team_resources.POST,
      {
        body: data,
        files:   { thumbnail_image: thumbnail } ,
      }
    );

    if (result.status == 201 && result.body) {
      return result.body;
    }

    throw new TeamResourcesException(
      "Failed to create team resource",
      "CREATE_ERROR",
      `Received status ${result.status}`
    );
  } catch (error) {
    if (error instanceof TeamResourcesException) throw error;
    throw new TeamResourcesException(
      "An unexpected error occurred while creating team resource",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
