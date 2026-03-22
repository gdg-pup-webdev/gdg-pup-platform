import { IOTPService } from "../domain/IAuthenticationInterfaces";

// This is a mock implementation. A real implementation would use the oneTimePin module.
export class OtpService implements IOTPService {
  async createAndSendOtpToEmail(email: string): Promise<string> {
    console.log(`Sending OTP to ${email}`);
    // In a real implementation, this would call the oneTimePin module
    // and return the reference from there.
    return Promise.resolve("mock-otp-reference");
  }

  async verifyOtp(reference: string, otp: string): Promise<boolean> {
    console.log(`Verifying OTP for reference ${reference}`);
    // In a real implementation, this would call the oneTimePin module.
    return Promise.resolve(otp === "123456"); // Mock verification
  }
}
