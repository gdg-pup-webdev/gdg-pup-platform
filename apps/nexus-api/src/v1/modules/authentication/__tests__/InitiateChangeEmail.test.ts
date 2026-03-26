import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/mocks/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/mocks/MockUserCredentialReferenceRepository.js";
import { MockEncryptionService } from "../infrastructure/mocks/MockEncryptionService.js";
import { MockOtpService } from "../infrastructure/mocks/MockOtpService.js"; 
import { UserCredential } from "../domain/UserCredential.js";
import { InitiateChangeEmail } from "../useCases/InitiateChangeEmail.js";

describe("InitiateChangeEmail", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let encryptionService: MockEncryptionService;
  let otpService: MockOtpService;
  let useCase: InitiateChangeEmail;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    encryptionService = new MockEncryptionService();
    otpService = new MockOtpService();
    useCase = new InitiateChangeEmail(credentialRepo, referenceRepo, encryptionService, otpService);
  });

  it("should create a reference code for email change", async () => {
    const email = "test@example.com";
    const newEmail = "new@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email, 
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const referenceCode = await useCase.execute(email, password, newEmail);

    expect(referenceCode).toBeDefined();
    const reference = await referenceRepo.findByReferenceCode(referenceCode);
    expect(reference).toBeDefined();
    expect(reference?.props.payload.newEmail).toBe(newEmail);
  });
});


