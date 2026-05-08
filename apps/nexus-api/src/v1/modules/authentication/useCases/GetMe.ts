import { IUserCredentialRepository } from "../domain/IAuthenticationInterfaces.js";
import { VerifyToken } from "./VerifyToken.js";

export class GetMe {
  constructor(
    private readonly verifyToken: VerifyToken,
    private readonly credentialRepo: IUserCredentialRepository
  ) {}

  async execute(token: string): Promise<any> {
    const payload = await this.verifyToken.execute(token);
    const email = payload.props.email;
    
    if (!email) {
      throw new Error("Invalid token: Email not found in payload");
    }

    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      throw new Error("User not found");
    }

    // In a real system, you'd fetch more from a public.user table
    // But for now we return what we have in credentials as per the schema
    return {
      id: credential.props.id,
      email: credential.props.emailAddress,
      display_name: credential.props.emailAddress, // Using username as display_name
      gdg_id: payload.props.memberInfo.gdgId,
      roles: payload.props.roles,
      permissions: payload.props.permissions,
    };
  }
}
