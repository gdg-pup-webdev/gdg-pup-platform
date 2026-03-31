import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/mocks/MockUserCredentialRepository.js";
import { MockUserCredentialReferenceRepository } from "../infrastructure/mocks/MockUserCredentialReferenceRepository.js";
import { MockOtpService } from "../infrastructure/mocks/MockOtpService.js"; 
import { UserCredential } from "../domain/UserCredential.js";
import { InitiateForgotPassword } from "../useCases/InitiateForgotPassword.js";

describe("InitiateForgotPassword", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let otpService: MockOtpService;
  let useCase: InitiateForgotPassword;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    otpService = new MockOtpService();
    useCase = new InitiateForgotPassword(credentialRepo, referenceRepo, otpService);
  });

  it("should create a reference code for forgot password", async () => {
    const email = "test@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email, 
      passwordHash: `hashed-${password}`,
    });
    await credentialRepo.saveNew(credential);

    const referenceCode = await useCase.execute(email);

    expect(referenceCode).toBeDefined();
    const reference = await referenceRepo.findByReferenceCode(referenceCode);
    expect(reference).toBeDefined();
    expect(reference?.props.type).toBe("FORGOT_PASSWORD");
    expect(reference?.props.emailAddress).toBe(email);
  });

  it("should throw an error if user does not exist", async () => {
    const email = "nonexistent@example.com";
    await expect(useCase.execute(email)).rejects.toThrow("User does not exist.");
  });
});
