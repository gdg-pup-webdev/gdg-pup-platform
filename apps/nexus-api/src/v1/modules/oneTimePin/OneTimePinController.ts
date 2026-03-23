import { CreateAndSendOtpToEmail } from "./useCases/CreateAndSendOtpToEmail";
import { VerifyOtp } from "./useCases/VerifyOtp";

export class OneTimePinController {
  constructor(
    private readonly createAndSendUC: CreateAndSendOtpToEmail,
    private readonly verifyUC: VerifyOtp
  ) {}

  async createAndSendOtpToEmail(email: string) {
    const reference = await this.createAndSendUC.execute(email);
    return { reference };
  }

  async verifyOtp(reference: string, otp: string) {
    const isValid = await this.verifyUC.execute(reference, otp);
    return { isValid };
  }
}
