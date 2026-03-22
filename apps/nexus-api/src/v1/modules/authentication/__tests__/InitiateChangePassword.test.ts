import { describe, it, expect, beforeEach } from "vitest";
import { InitiateChangePassword } from "../../useCases/InitiateChangePassword";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockUserCredentialReferenceRepository } from "./__mocks__/MockUserCredentialReferenceRepository";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";
import { MockOtpService } from "./__mocks__/MockOtpService";
import { UserCredential } from "../../domain/UserCredential";

describe("InitiateChangePassword", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let encryptionService: MockEncryptionService;
  let otpService: MockOtpService;
  let useCase: InitiateChangePassword;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    encryptionService = new MockEncryptionService();
    otpService = new MockOtpService();
    useCase = new InitiateChangePassword(credentialRepo, referenceRepo, encryptionService, otpService);
  });

  it("should create a reference code for password change", async () => {
    const email = "test@example.com";
    const password = "password";
    const newPassword = "newPassword";
    const credential = UserCredential.create({
      emailAddress: email,
      username: "test",
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const referenceCode = await useCase.execute(email, password, newPassword);

    expect(referenceCode).toBeDefined();
    const reference = await referenceRepo.findByReferenceCode(referenceCode);
    expect(reference).toBeDefined();
    expect(reference?.props.payload.newPasswordHash).toBe(`hashed-${newPassword}`);
  });
});
