import { describe, it, expect, beforeEach } from "vitest";
import { FinalizeChangePassword } from "../../useCases/FinalizeChangePassword";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockUserCredentialReferenceRepository } from "./__mocks__/MockUserCredentialReferenceRepository";
import { MockOtpService } from "./__mocks__/MockOtpService";
import { UserCredential } from "../../domain/UserCredential";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../../domain/UserCredentialReferenceCode";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";

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
      username: "test",
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
