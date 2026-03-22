import { ICustomAuthRepository } from "../domain/IAuthenticationInterfaces";

export class ChangeEmail {
  constructor(
    private readonly repo: ICustomAuthRepository
  ) {}

  async execute(email: string, newEmail: string, otp: string): Promise<void> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found.");

    if (!user.isOtpValid(otp)) {
      throw new Error("Invalid or expired OTP.");
    }

    const existingNew = await this.repo.findByEmail(newEmail);
    if (existingNew) throw new Error("Target email already in use.");

    user.updateEmail(newEmail);
    await this.repo.persistUpdates(user);
  }
}
