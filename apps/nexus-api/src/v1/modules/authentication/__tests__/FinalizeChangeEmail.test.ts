import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/MockUserCredentialReferenceRepository.js";
import { MockOtpService } from "../infrastructure/MockOtpService.js"; 
import { MockEncryptionService } from "../infrastructure/MockEncryptionService.js";
import { UserCredential } from "../domain/UserCredential.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { FinalizeChangeEmail } from "../useCases/FinalizeChangeEmail.js";

describe("FinalizeChangeEmail", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let otpService: MockOtpService;
  let encryptionService: MockEncryptionService;
  let useCase: FinalizeChangeEmail;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    otpService = new MockOtpService();
    encryptionService = new MockEncryptionService();
    useCase = new FinalizeChangeEmail(credentialRepo, referenceRepo, otpService);
  });

  it("should change the email with a valid otp", async () => {
    const email = "test@example.com";
    const newEmail = "new@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email,
      username: "test",
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CHANGE_EMAIL,
      otpReference: "mock-otp-reference",
      payload: { newEmail },
    });
    await referenceRepo.saveNew(reference);

    const result = await useCase.execute(reference.props.referenceCode, "123456");

    expect(result).toBe(true);
    const updatedCredential = await credentialRepo.findByEmail(newEmail);
    expect(updatedCredential?.props.emailAddress).toBe(newEmail);
  });
});


