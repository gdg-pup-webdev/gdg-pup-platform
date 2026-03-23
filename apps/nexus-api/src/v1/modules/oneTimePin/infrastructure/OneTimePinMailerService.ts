import { IOTPMailerService } from "../domain/IOneTimePinInterfaces";
import { mailerController } from "../../mailer";

export class OneTimePinMailerService implements IOTPMailerService {
  async sendOtp(email: string, otp: string): Promise<void> {
    await mailerController.sendEmail(
      email,
      "Your OTP Code",
      `Your verification code is: ${otp}. It will expire in 10 minutes.`
    );
  }
}
