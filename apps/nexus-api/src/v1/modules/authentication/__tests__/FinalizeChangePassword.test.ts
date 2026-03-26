import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/MockUserCredentialReferenceRepository.js";
import { MockOtpService } from "../infrastructure/MockOtpService.js"; 
import { MockEncryptionService } from "../infrastructure/MockEncryptionService.js";
import { UserCredential } from "../domain/UserCredential.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { FinalizeChangePassword } from "../useCases/FinalizeChangePassword.js";

describe("FinalizeChangePassword", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let otpService: MockOtpService;
  let encryptionService: MockEncryptionService;
  let useCase: FinalizeChangePassword;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    otpService = new MockOtpService();
    encryptionService = new MockEncryptionService();
    useCase = new FinalizeChangePassword(credentialRepo, referenceRepo, otpService);
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
      type: ReferenceCodeType.CHANGE_PASSWORD,
      otpReference: "mock-otp-reference",
      payload: { newPasswordHash: await encryptionService.hash(newPassword) },
    });
    await referenceRepo.saveNew(reference);

    const result = await useCase.execute(reference.props.referenceCode, "123456");

    expect(result).toBe(true);
    const updatedCredential = await credentialRepo.findByEmail(email);
    expect(updatedCredential?.props.passwordHash).toBe(`hashed-${newPassword}`);
  });
});


