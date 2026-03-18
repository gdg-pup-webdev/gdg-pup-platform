import { buildPaginationMeta } from "@/v1/utils/controller.utils";
import { teamModuleController } from "@/v1/modules/teamsSystem";
import {
  TeamMemberResponseDTO,
  TeamResponseDTO,
} from "@/v1/modules/teamsSystem/TeamModuleController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

function toTeamRow(team: TeamResponseDTO, members: TeamMemberResponseDTO[]) {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    responsibilities: team.responsibilities,
    parent_team_id: team.parentTeamId,
    members: members.map((member) => ({
      id: member.id,
      team_id: member.teamId,
      user_id: member.userId,
      name: member.name ?? "",
      position: member.position,
      image: member.image,
    })),
  };
}

function toMemberRow(member: TeamMemberResponseDTO) {
  return {
    id: member.id,
    team_id: member.teamId,
    user_id: member.userId,
    name: member.name ?? "",
    position: member.position,
    image: member.image,
  };
}

export class GdgTeamsHttpController {
  listTeams: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await teamModuleController.listTeams(
        pageNumber,
        pageSize,
      );

      const data = await Promise.all(
        list.map(async (team) => {
          const members = await teamModuleController.listMembers(1, 100, {
            teamId: team.id,
          });
          return toTeamRow(team, members.list);
        }),
      );

      return output(200, {
        status: "success",
        message: "Teams fetched successfully",
        data,
        meta: buildPaginationMeta(count, pageNumber, pageSize),
      });
    },
  );

  searchTeams: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.search.GET,
    async ({ input, output }) => {
      const query = input.query.q;
      const limit = parseInt(input.query.limit || "10", 10);

      const list = await teamModuleController.searchTeams(query, limit);

      const data = await Promise.all(
        list.map(async (team) => {
          const members = await teamModuleController.listMembers(1, 100, {
            teamId: team.id,
          });
          return toTeamRow(team, members.list);
        }),
      );

      return output(200, {
        status: "success",
        message: "Teams searched successfully",
        data,
      });
    },
  );

  createTeam: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.POST,
    async ({ input, output }) => {
      const team = await teamModuleController.createTeam({
        name: input.body.data.name,
        description: input.body.data.description,
        responsibilities: input.body.data.responsibilities,
        parentTeamId: input.body.data.parent_team_id,
      });

      const members = await Promise.all(
        (input.body.data.members || []).map((member) =>
          teamModuleController.addMember({
            teamId: team.id,
            userId: member.user_id,
            role: member.position,
          }),
        ),
      );

      return output(200, {
        status: "success",
        message: "Team created successfully",
        data: toTeamRow(team, members),
      });
    },
  );

  getOneTeam: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.GET,
    async ({ input, output }) => {
      const team = await teamModuleController.getTeam(input.params.gdgTeamId);
      const members = await teamModuleController.listMembers(1, 100, {
        teamId: team.id,
      });

      return output(200, {
        status: "success",
        message: "Team fetched successfully",
        data: toTeamRow(team, members.list),
      });
    },
  );

  updateTeam: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.PATCH,
    async ({ input, output }) => {
      const team = await teamModuleController.updateTeam(
        input.params.gdgTeamId,
        {
          name: input.body.data.name,
          description: input.body.data.description,
          responsibilities: input.body.data.responsibilities,
          parentTeamId: input.body.data.parent_team_id,
        },
      );

      let members = await teamModuleController.listMembers(1, 100, {
        teamId: team.id,
      });

      if (input.body.data.members) {
        await Promise.all(
          members.list.map((member) =>
            teamModuleController.removeMember(member.id),
          ),
        );

        const recreatedMembers = await Promise.all(
          input.body.data.members.map((member) =>
            teamModuleController.addMember({
              teamId: team.id,
              userId: member.user_id,
              role: member.position,
            }),
          ),
        );

        members = { list: recreatedMembers, count: recreatedMembers.length };
      }

      return output(200, {
        status: "success",
        message: "Team updated successfully",
        data: toTeamRow(team, members.list),
      });
    },
  );

  deleteTeam: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.DELETE,
    async ({ input, output }) => {
      await teamModuleController.deleteTeam(input.params.gdgTeamId);
      return output(200, {
        status: "success",
        message: "Team deleted successfully",
      });
    },
  );

  listMembers: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.members.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const { list, count } = await teamModuleController.listMembers(
        pageNumber,
        pageSize,
        { teamId: input.params.gdgTeamId },
      );

      return output(200, {
        status: "success",
        message: "Team members fetched successfully",
        data: list.map(toMemberRow),
        meta: buildPaginationMeta(count, pageNumber, pageSize),
      });
    },
  );

  addMember: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.members.POST,
    async ({ input, output }) => {
      const member = await teamModuleController.addMember({
        teamId: input.params.gdgTeamId,
        userId: input.body.data.user_id,
        role: input.body.data.position,
      });

      return output(200, {
        status: "success",
        message: "Team member added successfully",
        data: toMemberRow(member),
      });
    },
  );

  getMember: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.members.memberId.GET,
    async ({ input, output }) => {
      const member = await teamModuleController.getMember(
        input.params.memberId,
      );

      return output(200, {
        status: "success",
        message: "Team member fetched successfully",
        data: toMemberRow(member),
      });
    },
  );

  updateMember: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.members.memberId.PATCH,
    async ({ input, output }) => {
      const member = await teamModuleController.updateMember(
        input.params.memberId,
        {
          role: input.body.data.position!,
        },
      );

      return output(200, {
        status: "success",
        message: "Team member updated successfully",
        data: toMemberRow(member),
      });
    },
  );

  deleteMember: RequestHandler = createExpressController(
    contract.api.v1.gdg_teams.gdgTeamId.members.memberId.DELETE,
    async ({ input, output }) => {
      await teamModuleController.removeMember(input.params.memberId);
      return output(200, {
        status: "success",
        message: "Team member removed successfully",
      });
    },
  );
}
