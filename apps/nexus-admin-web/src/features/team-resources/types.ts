import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

/**
 * Team Resource Domain Types
 */

/** Full Team Resource object from the API */
export type TeamResource = typeof contract.api.v1.team_resources.GET.response[200]["data"]["list"][number];

/** Paginated response from the Team Resource API */
export type TeamResourcesResponse = typeof contract.api.v1.team_resources.GET.response[200];

/** Query parameters for filtering and pagination */
export type TeamResourcesQueryParams = typeof contract.api.v1.team_resources.GET.query;

/** Payload for creating a new team resource */
export type CreateTeamResourceDTO = typeof contract.api.v1.team_resources.POST.body;

/** Payload for updating an existing team resource */
export type UpdateTeamResourceDTO = typeof contract.api.v1.team_resources.PATCH.body;

/**
 * Custom exception class for team resource-related errors
 */
export class TeamResourcesException extends Error {
  constructor(
    public override message: string,
    public code: string = "TEAM_RESOURCES_ERROR",
    public detail: string = ""
  ) {
    super(message);
    this.name = "TeamResourcesException";
  }
}
