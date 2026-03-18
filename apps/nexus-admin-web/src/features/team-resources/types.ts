import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

/**
 * Team Resource Domain Types
 */

/** Full Team Resource object from the API */
export type TeamResource = contract.api.v1.team_resources.GET.response[200]["data"][number];

/** Paginated response from the Team Resource API */
export type TeamResourcesResponse = contract.api.v1.team_resources.GET.response[200];

/** Query parameters for filtering and pagination */
export type TeamResourcesQueryParams = z.infer<typeof contract.api.v1.team_resources.GET.request.query>;

/** Payload for creating a new team resource */
export type CreateTeamResourceDTO = z.infer<typeof contract.api.v1.team_resources.POST.request.body>["data"];

/** Payload for updating an existing team resource */
export type UpdateTeamResourceDTO = z.infer<typeof contract.api.v1.team_resources.teamResourceId.PATCH.request.body>["data"];

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
