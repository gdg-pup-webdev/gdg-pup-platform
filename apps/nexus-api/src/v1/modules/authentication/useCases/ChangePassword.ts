import { ICustomAuthRepository, IEncryptionService } from "../domain/IAuthenticationInterfaces";

export class ChangePassword {
  constructor(
    private readonly repo: ICustomAuthRepository,
    private readonly encryption: IEncryptionService
  ) {}

  async execute(email: string, newPassword: string, otp: string): Promise<void> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found.");

    if (!user.isOtpValid(otp)) {
      throw new Error("Invalid or expired OTP.");
    }

    const hash = await this.encryption.hash(newPassword);
    user.updatePassword(hash);
    await this.repo.persistUpdates(user);
  }
}
