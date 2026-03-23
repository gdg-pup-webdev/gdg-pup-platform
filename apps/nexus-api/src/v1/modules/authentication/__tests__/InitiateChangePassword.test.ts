import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/MockUserCredentialReferenceRepository.js";
import { MockEncryptionService } from "../infrastructure/MockEncryptionService.js";
import { MockOtpService } from "../infrastructure/MockOtpService.js"; 
import { UserCredential } from "../domain/UserCredential.js";
import { InitiateChangePassword } from "../useCases/InitiateChangePassword.js";

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


