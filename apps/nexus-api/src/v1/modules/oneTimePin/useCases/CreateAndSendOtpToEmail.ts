import { IOTPRepository, IOTPMailerService } from "../domain/IOneTimePinInterfaces";
import { OneTimePin } from "../domain/OneTimePin";

export class CreateAndSendOtpToEmail {
  constructor(
    private readonly repo: IOTPRepository,
    private readonly mailer: IOTPMailerService
  ) {}

  async execute(email: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otp = OneTimePin.create({
      email,
      otpCode,
      expiresAt
    });

    await this.repo.saveNew(otp);
    await this.mailer.sendOtp(email, otpCode);

    return otp.props.reference;
  }
}
