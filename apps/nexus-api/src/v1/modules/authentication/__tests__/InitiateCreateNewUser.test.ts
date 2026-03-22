import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialReferenceRepository } from "../infrastructure/MockUserCredentialReferenceRepository.js";
import { MockEncryptionService } from "../infrastructure/MockEncryptionService.js";
import { MockOtpService } from "../infrastructure/MockOtpService.js";
import { InitiateCreateNewUser } from "../useCases/InitiateCreateNewUser.js";

describe("InitiateCreateNewUser", () => {
  let referenceRepo: MockUserCredentialReferenceRepository;
  let encryptionService: MockEncryptionService;
  let otpService: MockOtpService;
  let useCase: InitiateCreateNewUser;

  beforeEach(() => {
    referenceRepo = new MockUserCredentialReferenceRepository();
    encryptionService = new MockEncryptionService();
    otpService = new MockOtpService();
    useCase = new InitiateCreateNewUser(referenceRepo, encryptionService, otpService);
  });

  it("should create a reference code for a new user", async () => {
    const email = "test@example.com";
    const password = "password";
    const referenceCode = await useCase.execute(email, password);

    expect(referenceCode).toBeDefined();
    const reference = await referenceRepo.findByReferenceCode(referenceCode);
    expect(reference).toBeDefined();
    expect(reference?.props.emailAddress).toBe(email);
    expect(reference?.props.payload.passwordHash).toBe(`hashed-${password}`);
  });
});


