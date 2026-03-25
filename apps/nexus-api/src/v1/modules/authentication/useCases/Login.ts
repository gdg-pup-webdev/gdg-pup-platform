import {
  IUserCredentialRepository,
  IEncryptionService,
  IJWTService,
  IRbacService,
  IGdgMemberService,
} from "../domain/IAuthenticationInterfaces.js"; 
import { TokenPayload } from "../domain/TokenPayload.js";

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
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await this.encryptionService.compare(
      password,
      credential.props.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    const permissions = await this.rbacService.listPermissionsOfUser(email);
    const memberInfo = await this.gdgMemberService.getMemberInfoByEmail(email);

    const tokenPayload = TokenPayload.create({
      email: credential.props.emailAddress,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      memberInfo,
      permissions,
    });

    const token = await this.jwtService.sign(tokenPayload);

    return token;
  }
}
