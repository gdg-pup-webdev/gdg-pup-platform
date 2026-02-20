import { RequestHandler } from "express"; 
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { TeamService } from "@/modules/teamsSystem/teams/team.service";

export class TeamsHttpController {
  constructor(
    private readonly teamService: TeamService  ,
  ) {}

  listTeams: RequestHandler = createExpressController(
    contract.api.team_system.teams.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const data = await this.teamService.listTeams();

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

      const data = await this.teamService.createTeam(dto, user.id);

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
      const data = await this.teamService.getOneTeam(teamId);

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
      const data = await this.teamService.updateTeam(teamId, dto);

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
      const data = await this.teamService.deleteTeam(teamId);

      return output(200, {
        status: "success",
        message: "Team deleted successfully",
      });
    },
  );
}
 