import { RequestHandler } from "express";
import { TeamService, teamServiceInstance } from "./team.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServerError, ServiceError } from "../../classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class TeamSystemController {
  constructor(private teamService: TeamService = teamServiceInstance) {}

  listTeams: RequestHandler = createExpressController(
    contract.api.team_system.teams.GET,
    async ({ input, output }) => {
      const { data, error } = await tryCatch(
        async () => await this.teamService.listTeams(),
        "listing teams",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Teams fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
          totalPages: Math.ceil(data.count / input.query.page.size),
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

      const { data, error } = await tryCatch(
        async () => await this.teamService.createTeam(dto, user.id),
        "creating team",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.teamService.getOneTeam(teamId),
        "fetching team",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.teamService.updateTeam(teamId, dto),
        "updating team",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.teamService.deleteTeam(teamId),
        "deleting team",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Team deleted successfully",
      });
    },
  );

  listMembers: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.members.GET,
    async ({ input, output }) => {
      const { teamId } = input.params;
      const { data, error } = await tryCatch(
        async () => await this.teamService.listMembers(teamId),
        "listing members",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Members fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: 1,
          pageSize: 100,
          totalPages: 1,
        },
      });
    },
  );

  createMember: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.members.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;

      const { data, error } = await tryCatch(
        async () => await this.teamService.createMember(input.body.data),
        "creating member",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Member created successfully",
        data,
      });
    },
  );

  deleteMember: RequestHandler = createExpressController(
    contract.api.team_system.teams.teamId.members.memberId.DELETE,
    async ({ input, output }) => {
      const { memberId } = input.params;
      const { data, error } = await tryCatch(
        async () => await this.teamService.deleteMember(memberId),
        "deleting member",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Member deleted successfully",
      });
    },
  );
}

export const teamSystemControllerInstance = new TeamSystemController();
