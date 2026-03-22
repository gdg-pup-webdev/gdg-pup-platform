import { ICustomAuthRepository, IEncryptionService, IJWTService } from "../domain/IAuthenticationInterfaces";

export class Login {
  constructor(
    private readonly repo: ICustomAuthRepository,
    private readonly encryption: IEncryptionService,
    private readonly jwt: IJWTService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials.");

    const isValid = await this.encryption.compare(password, user.props.passwordHash);
    if (!isValid) throw new Error("Invalid credentials.");

    return this.jwt.sign({ 
      email: user.props.emailAddress, 
      username: user.props.username 
    });
  }
}
