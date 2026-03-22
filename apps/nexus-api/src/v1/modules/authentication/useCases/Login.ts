import { IUserCredentialRepository, IEncryptionService, IJWTService } from "../domain/IAuthenticationInterfaces";

export class Login {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtService: IJWTService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await this.encryptionService.compare(password, credential.props.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    const token = await this.jwtService.sign({
      username: credential.props.username,
      email: credential.props.emailAddress,
    });

    return token;
  }
}
