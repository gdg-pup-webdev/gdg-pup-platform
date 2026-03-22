import { describe, it, expect, beforeEach } from "vitest";
import { FinalizeChangeEmail } from "../../useCases/FinalizeChangeEmail";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockUserCredentialReferenceRepository } from "./__mocks__/MockUserCredentialReferenceRepository";
import { MockOtpService } from "./__mocks__/MockOtpService";
import { UserCredential } from "../../domain/UserCredential";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../../domain/UserCredentialReferenceCode";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";

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
