import { ICustomAuthRepository, IEncryptionService } from "../domain/Interfaces";
import { User } from "../domain/User";

export class ChangePasswordUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(username: string, newPasswordRaw: string, oldPasswordRaw: string): Promise<User> {
    const user = await this.repository.findByUsername(username);
    if (!user) throw new Error("User not found.");

    const isValid = await this.encryptionService.compare(oldPasswordRaw, user.password);
    if (!isValid) throw new Error("Invalid current password.");

    const hashedNew = await this.encryptionService.hash(newPasswordRaw);
    user.update({ password: hashedNew });
    await this.repository.persistUpdates(user);
    return user;
  }
}
