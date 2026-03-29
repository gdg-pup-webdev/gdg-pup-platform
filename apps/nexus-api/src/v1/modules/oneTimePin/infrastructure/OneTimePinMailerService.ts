import { IOTPMailerService } from "../domain/IOneTimePinInterfaces";
import { mailerController, OtpEmailTemplate } from "../../mailer";

export class OneTimePinMailerService implements IOTPMailerService {
  async sendOtp(email: string, otp: string): Promise<void> {
    await mailerController.sendEmail(
      email,
      "Your OTP Code",
      OtpEmailTemplate.render(otp)
    );
  }
}
