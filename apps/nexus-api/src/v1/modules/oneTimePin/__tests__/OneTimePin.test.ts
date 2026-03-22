import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockOTPRepository } from "../infrastructure/MockOTPRepository";
import { IOTPMailerService } from "../domain/IOneTimePinInterfaces";
import { CreateAndSendOtpToEmail } from "../useCases/CreateAndSendOtpToEmail";
import { VerifyOtp } from "../useCases/VerifyOtp";
import { OneTimePinController } from "../OneTimePinController";

describe("OneTimePin Module", () => {
  let repo: MockOTPRepository;
  let mailer: IOTPMailerService;
  let controller: OneTimePinController;

  beforeEach(() => {
    repo = new MockOTPRepository();
    mailer = {
      sendOtp: vi.fn().mockResolvedValue(undefined)
    };
    controller = new OneTimePinController(
      new CreateAndSendOtpToEmail(repo, mailer),
      new VerifyOtp(repo)
    );
  });

  it("should create and send OTP, then verify it successfully", async () => {
    const email = "user@example.com";
    
    const { reference } = await controller.createAndSendOtpToEmail(email);
    expect(reference).toBeDefined();
    expect(mailer.sendOtp).toHaveBeenCalledWith(email, expect.any(String));

    const sentOtp = (mailer.sendOtp as any).mock.calls[0][1];
    
    const { isValid } = await controller.verifyOtp(reference, sentOtp);
    expect(isValid).toBe(true);

    // Should not be valid if used again
    const { isValid: isValidAgain } = await controller.verifyOtp(reference, sentOtp);
    expect(isValidAgain).toBe(false);
  });

  it("should fail verification with wrong OTP", async () => {
    const { reference } = await controller.createAndSendOtpToEmail("test@test.com");
    const { isValid } = await controller.verifyOtp(reference, "wrong-otp");
    expect(isValid).toBe(false);
  });

  it("should fail verification with non-existent reference", async () => {
    const { isValid } = await controller.verifyOtp("non-existent-uuid", "123456");
    expect(isValid).toBe(false);
  });
});
