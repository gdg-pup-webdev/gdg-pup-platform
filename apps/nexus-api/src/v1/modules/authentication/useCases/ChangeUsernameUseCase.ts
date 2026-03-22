import { ICustomAuthRepository, IEncryptionService } from "../domain/Interfaces";
import { User } from "../domain/User";

export class ChangeUsernameUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(currentUsername: string, newUsername: string, passwordRaw: string): Promise<User> {
    const user = await this.repository.findByUsername(currentUsername);
    if (!user) throw new Error("User not found.");

    const isValid = await this.encryptionService.compare(passwordRaw, user.password);
    if (!isValid) throw new Error("Invalid credentials.");

    const existing = await this.repository.findByUsername(newUsername);
    if (existing) throw new Error("Username already in use.");

    user.update({ username: newUsername });
    await this.repository.persistUpdates(user);
    return user;
  }
}
