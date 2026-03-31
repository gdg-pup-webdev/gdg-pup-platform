import { IOTPMailerService } from "../domain/IOneTimePinInterfaces";
import { mailerController, OtpEmailTemplate } from "../../mailer";

export class OneTimePinMailerService implements IOTPMailerService {
  async sendOtp(email: string, otp: string, context?: string): Promise<void> {
    const subject = context ? `${context}` : "Your OTP Code";
    await mailerController.sendEmail(
      email,
      subject,
      OtpEmailTemplate.render(otp, context)
    );
  }
}
