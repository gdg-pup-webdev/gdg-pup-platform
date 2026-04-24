import {
  IUserCredentialRepository,
  IEncryptionService,
  IJWTService,
  IRbacService,
  IGdgMemberService,
} from "../domain/IAuthenticationInterfaces.js"; 
import { TokenPayload } from "../domain/TokenPayload.js";
import { configs } from "@/configs/configs.js";
import { UnauthorizedError } from "@/v1/errors/HttpError.js";

export class Login {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtService: IJWTService,
    private readonly rbacService: IRbacService,
    private readonly gdgMemberService: IGdgMemberService,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      throw new UnauthorizedError("No account found with the provided email address.");
    }

    const isPasswordValid = await this.encryptionService.compare(
      password,
      credential.props.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("The password that you entered is incorrect.");
    }

    const permissions = await this.rbacService.listPermissionsOfUser(email);
    const roles = await this.rbacService.listRolesOfUser(email);
    const memberInfo = await this.gdgMemberService.getMemberInfoByEmail(email);

    const now = Date.now();
    const tokenPayload = TokenPayload.create({
      email: credential.props.emailAddress,
      validUntil: new Date(now + 1000 * 60 * configs.session.timeoutMinutes).toISOString(),
      loginTime: new Date(now).toISOString(),
      memberInfo,
      permissions,
      roles,
    });

    const token = await this.jwtService.sign(tokenPayload);

    return token;
  }
}
