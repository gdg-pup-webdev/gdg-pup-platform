import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError_DEPRECATED } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { MemberService, memberServiceInstance } from "./member.service.js";

export class MemberController {
  constructor(
    private readonly memberService: MemberService = memberServiceInstance,
  ) {}

  listMembersWithFilter: RequestHandler = createExpressController(
    contract.api.team_system.members.GET,
    async ({ input, output }) => {
      // pagination stuff
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // filter stuff
      const teamId = input.query.teamId;
      const userId = input.query.userId;
      const role = input.query.role;

      const data = await this.memberService.listMembersWithFilter(
        pageNumber,
        pageSize,
        {
          teamId,
          userId,
          role,
        },
      );

      return output(200, {
        status: "success",
        message: "Members fetched successfully",
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

  createMember: RequestHandler = createExpressController(
    contract.api.team_system.members.POST,
    async ({ input, output }) => {
      const data = await this.memberService.createMember(input.body.data);

      return output(200, {
        status: "success",
        message: "Member created successfully",
        data,
      });
    },
  );

  deleteMember: RequestHandler = createExpressController(
    contract.api.team_system.members.memberId.DELETE,
    async ({ input, output }) => {
      const { memberId } = input.params;
      const data = await this.memberService.deleteMember(memberId);

      return output(200, {
        status: "success",
        message: "Member deleted successfully",
      });
    },
  );
}

export const memberControllerInstance = new MemberController();
