import { GdgMembersController } from "../../members/GdgMembersController.js";
import { IGdgMemberService } from "../domain/IAuthenticationInterfaces.js";
import { MemberInfo } from "../domain/TokenPayload.js";

export class GdgMemberService implements IGdgMemberService {
  constructor(private readonly gdgMembersController: GdgMembersController) {}

  async getMemberInfoByEmail(email: string): Promise<MemberInfo> {
    const member = await this.gdgMembersController.findByEmail(email);
    if (!member) {
      throw new Error("Member not found");
    }

    return {
      gdgId: member.gdgId,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      suffix: member.suffix,
      avatarUrl: member.avatarUrl,
      program: member.program,
      yearLevel: member.yearLevel,
      department: member.department,
    };
  }
}
