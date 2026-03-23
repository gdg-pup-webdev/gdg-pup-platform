import { IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { OneTimePinController } from "../../oneTimePin/OneTimePinController.js";

export class OtpService implements IOTPService {
  constructor(private readonly otpController: OneTimePinController) {}

  async createAndSendOtpToEmail(email: string): Promise<string> {
    const { reference } = await this.otpController.createAndSendOtpToEmail(email);
    return reference;
  }

  async verifyOtp(reference: string, otp: string): Promise<boolean> {
    const { isValid } = await this.otpController.verifyOtp(reference, otp);
    return isValid;
  }
}

