import { IOTPService } from "../../domain/IAuthenticationInterfaces";

export class MockOtpService implements IOTPService {
  async createAndSendOtpToEmail(email: string): Promise<string> {
    return Promise.resolve("mock-otp-reference");
  }

  async verifyOtp(reference: string, otp: string): Promise<boolean> {
    return Promise.resolve(otp === "123456");
  }
}
