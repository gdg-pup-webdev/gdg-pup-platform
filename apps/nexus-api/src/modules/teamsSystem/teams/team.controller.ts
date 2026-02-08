import { RequestHandler } from "express";
import { TeamService, teamServiceInstance } from "./team.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError_DEPRECATED } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";

export class TeamController {
  constructor(private readonly teamService: TeamService = teamServiceInstance) {}

  listTeams: RequestHandler = createExpressController(
    contract.api.team_system.teams.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const { data, error } = await tryCatch_deprecated(
        async () => await this.teamService.listTeams(),
        "On controller, listing teams",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Teams fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  createTeam: RequestHandler = createExpressController(
    contract.api.team_system.teams.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const dto = input.body.data;

      const { data, error } = await tryCatch_deprecated(
        async () => await this.teamService.createTeam(dto, user.id),
        "creating team",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Team created successfully",
        data,
      });
    },
  );

  getOneTeam: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.GET,
    async ({ input, output }) => {
      const { teamId } = input.params;
      const { data, error } = await tryCatch_deprecated(
        async () => await this.teamService.getOneTeam(teamId),
        "fetching team",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Team fetched successfully",
        data,
      });
    },
  );

  updateTeam: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.PATCH,
    async ({ input, output }) => {
      const { teamId } = input.params;
      const dto = input.body.data;
      const { data, error } = await tryCatch_deprecated(
        async () => await this.teamService.updateTeam(teamId, dto),
        "updating team",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Team updated successfully",
        data,
      });
    },
  );

  deleteTeam: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.DELETE,
    async ({ input, output }) => {
      const { teamId } = input.params;
      const { data, error } = await tryCatch_deprecated(
        async () => await this.teamService.deleteTeam(teamId),
        "deleting team",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Team deleted successfully",
      });
    },
  );
}

export const teamControllerInstance = new TeamController();
