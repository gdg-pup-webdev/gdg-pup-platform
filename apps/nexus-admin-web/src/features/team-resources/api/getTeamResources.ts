/**
 * API function to fetch team resources from Nexus API
 * 
 * Retrieves a paginated list of team resources with optional filtering.
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts"; 
import { TeamResourcesException, TeamResourcesQueryParams, TeamResourcesResponse } from "../types";
import { configs } from "@/lib/constants/configs";

/**
 * Fetch team resources from the Nexus API
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated team resources response
 * @throws TeamResourcesException if the request fails
 */
export async function getTeamResources(
  params: Partial<TeamResourcesQueryParams> = {}
)  {
  try {
    // Set default pagination
    const queryParams = {
      pageNumber: 1,
      pageSize: 10,
      ...params,
    };

    // Call the team resources endpoint
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.team_resources.GET,
      {
        query: queryParams,
      }
    );

    // Check for successful response
    if (result.status == 200 && result.body) {
      return result.body 
    }

    // Handle error responses
    throw new TeamResourcesException(
      "Failed to fetch team resources",
      "FETCH_ERROR",
      `Received status ${result.status}`
    );

  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new TeamResourcesException(
        `Failed to connect to Nexus API at ${configs.nexusApiBaseUrl}. Please check if the API is running.`,
        "NETWORK_ERROR",
        error.message
      );
    }

    // Timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new TeamResourcesException(
        "Request timed out while fetching team resources",
        "TIMEOUT_ERROR",
        "The request took too long to complete"
      );
    }

    // Re-throw TeamResourcesException
    if (error instanceof TeamResourcesException) {
      throw error;
    }

    // Unknown errors
    throw new TeamResourcesException(
      "An unexpected error occurred while fetching team resources",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
