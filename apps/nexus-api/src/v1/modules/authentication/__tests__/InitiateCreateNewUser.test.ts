import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialReferenceRepository } from "../infrastructure/mocks/MockUserCredentialReferenceRepository.js";
import { MockEncryptionService } from "../infrastructure/mocks/MockEncryptionService.js";
import { MockOtpService } from "../infrastructure/mocks/MockOtpService.js";
import { MockMemberCheckService } from "../infrastructure/mocks/MockMemberCheckService.js";
import { InitiateCreateNewUser } from "../useCases/InitiateCreateNewUser.js";
import { MockUserCredentialRepository } from "../infrastructure/mocks/MockUserCredentialRepository.js";

describe("InitiateCreateNewUser", () => {
  let referenceRepo: MockUserCredentialReferenceRepository;
  let encryptionService: MockEncryptionService;
  let otpService: MockOtpService;
  let memberCheckService: MockMemberCheckService;
  let useCase: InitiateCreateNewUser;

  beforeEach(() => {
    referenceRepo = new MockUserCredentialReferenceRepository();
    encryptionService = new MockEncryptionService();
    otpService = new MockOtpService();
    memberCheckService = new MockMemberCheckService();
    useCase = new InitiateCreateNewUser(referenceRepo, encryptionService, otpService, memberCheckService, new MockUserCredentialRepository());
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


