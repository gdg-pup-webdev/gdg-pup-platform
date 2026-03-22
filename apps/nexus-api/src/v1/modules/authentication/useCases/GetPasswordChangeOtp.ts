import { ICustomAuthRepository } from "../domain/IAuthenticationInterfaces";

export class GetPasswordChangeOtp {
  constructor(
    private readonly repo: ICustomAuthRepository
  ) {}

  async execute(email: string): Promise<string> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found.");

    const otp = this.repo.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    user.setOtp(otp, expiresAt);
    await this.repo.persistUpdates(user);
    return otp;
  }
}
