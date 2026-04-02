import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/mocks/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/mocks/MockUserCredentialReferenceRepository.js";
import { MockOtpService } from "../infrastructure/mocks/MockOtpService.js"; 
import { MockEncryptionService } from "../infrastructure/mocks/MockEncryptionService.js";
import { UserCredential } from "../domain/UserCredential.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { FinalizeForgotPassword } from "../useCases/FinalizeForgotPassword.js";

describe("FinalizeForgotPassword", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let otpService: MockOtpService;
  let encryptionService: MockEncryptionService;
  let useCase: FinalizeForgotPassword;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    otpService = new MockOtpService();
    encryptionService = new MockEncryptionService();
    useCase = new FinalizeForgotPassword(credentialRepo, referenceRepo, encryptionService, otpService);
  });

  it("should change the password with a valid otp", async () => {
    const email = "test@example.com";
    const password = "password";
    const newPassword = "newPassword";
    const credential = UserCredential.create({
      emailAddress: email, 
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.FORGOT_PASSWORD,
      otpReference: "mock-otp-reference",
      payload: {},
    });
    await referenceRepo.saveNew(reference);

    await useCase.execute(reference.props.referenceCode, "123456", newPassword);

    const updatedCredential = await credentialRepo.findByEmail(email);
    expect(updatedCredential?.props.passwordHash).toBe(`hashed-${newPassword}`);

    const deletedReference = await referenceRepo.findByReferenceCode(reference.props.referenceCode);
    expect(deletedReference).toBeNull();
  });

  it("should throw an error with an invalid otp", async () => {
    const email = "test@example.com";
    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.FORGOT_PASSWORD,
      otpReference: "mock-otp-reference",
      payload: {},
    });
    await referenceRepo.saveNew(reference);

    // MockOtpService.verifyOtp returns true if otp is "123456"
    await expect(useCase.execute(reference.props.referenceCode, "wrong-otp", "newPassword")).rejects.toThrow("Invalid OTP code.");
  });
});
