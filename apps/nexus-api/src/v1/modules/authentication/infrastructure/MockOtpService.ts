import { IOTPService } from "../domain/IAuthenticationInterfaces.js";

export class MockOtpService implements IOTPService {
  async createAndSendOtpToEmail(email: string): Promise<string> {
    // Return a dummy reference
    return Promise.resolve("mock-otp-reference");
  }

  async verifyOtp(reference: string, otp: string): Promise<boolean> {
    // Accept "123456" as the valid OTP for testing
    return Promise.resolve(otp === "123456");
  }
}

