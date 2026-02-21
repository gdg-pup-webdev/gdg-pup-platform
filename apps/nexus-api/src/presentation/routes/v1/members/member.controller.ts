import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { RequestHandler } from "express";
import { MemberService } from "@/modules/memberSystem";

export class MembersHttpController {
  constructor(private readonly service: MemberService) {}

  checkMembership: RequestHandler = createExpressController(
    contract.api.member_system.check_membership.GET,
    async ({ input, output }) => {
      const { email } = input.query;
      const member = await this.service.checkMemberByEmail(email);

      return output(200, {
        status: "success",
        message: "Membership check completed",
        data: {
          isMember: !!member,
          member: member,
        },
      });
    },
  );
}
