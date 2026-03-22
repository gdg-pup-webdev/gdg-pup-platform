import { User } from "../domain/User";
import { ICustomAuthRepository, IEncryptionService, IJWTService } from "../domain/Interfaces";

export class LoginUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtService: IJWTService
  ) {}

  async execute(username: string, passwordRaw: string): Promise<{ user: User, token: string }> {
    const user = await this.repository.findByUsername(username);
    if (!user) throw new Error("Invalid credentials.");

    const isValid = await this.encryptionService.compare(passwordRaw, user.password);
    if (!isValid) throw new Error("Invalid credentials.");

    const token = await this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return { user, token };
  }
}
