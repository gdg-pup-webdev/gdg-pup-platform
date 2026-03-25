import { IGdgMemberService } from "../domain/IAuthenticationInterfaces.js";
import { MemberInfo } from "../domain/TokenPayload.js";

export class MockGdgMemberService implements IGdgMemberService {
  public memberInfo: MemberInfo = {
    gdgId: "mock-gdg-id",
    firstName: "Mock",
    middleName: null,
    lastName: "User",
    suffix: null,
  };

  async getMemberInfoByEmail(email: string): Promise<MemberInfo> {
    return this.memberInfo;
  }
}
