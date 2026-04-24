import { IGdgMemberService, IJWTService, IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { TokenPayload } from "../domain/TokenPayload.js";
import { configs } from "@/configs/configs.js";
import { VerifyToken } from "./VerifyToken.js";

export class RefreshToken {
  constructor(
      private readonly verifyToken: VerifyToken,
      private readonly jwtService: IJWTService,
      private readonly rbacService: IRbacService,
      private readonly gdgMemberService: IGdgMemberService,) {}

  async execute(token: string) {
    const payload = await this.verifyToken.execute(token);
 
    if (!payload) {
      throw new Error("Invalid token.");
    }

    // Enforce absolute 2-hour limit: reject refresh if original login is > SESSION_TIMEOUT_MINUTES ago
    const loginTime = new Date(payload.props.loginTime);
    const sessionTimeoutMs = configs.session.timeoutMinutes * 60 * 1000;
    if (Date.now() - loginTime.getTime() > sessionTimeoutMs) {
      throw new Error("Session expired. Please login again.");
    }
 
    const gdgId = payload.props.memberInfo.gdgId;

    const {permissions , roles} = await this.rbacService.listPermissionsAndRolesByGdgId(gdgId);
    const memberInfo = await this.gdgMemberService.getMemberInfoByGdgId(gdgId);

    const email = memberInfo.email;

    const now = Date.now();
    const tokenPayload = TokenPayload.create({
      email: email,
      validUntil: new Date(now + 1000 * 60 * configs.session.timeoutMinutes).toISOString(),
      loginTime: new Date(now).toISOString(),
      memberInfo,
      permissions,
      roles,
    });

    const newToken = await this.jwtService.sign(tokenPayload);

    return newToken;
  }
}
