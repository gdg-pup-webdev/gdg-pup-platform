import { describe, it, expect, beforeEach } from "vitest";
import { Login } from "../useCases/Login.js";
import { MockUserCredentialRepository } from "../infrastructure/mocks/MockUserCredentialRepository.js";
import { MockEncryptionService } from "../infrastructure/mocks/MockEncryptionService.js";
import { MockJwtService } from "../infrastructure/mocks/MockJwtService.js";
import { UserCredential } from "../domain/UserCredential.js";
import { MockRbacService } from "../infrastructure/mocks/MockRbacService.js";
import { MockGdgMemberService } from "../infrastructure/mocks/MockGdgMemberService.js";

describe("Login", () => {
  let credentialRepo: MockUserCredentialRepository;
  let encryptionService: MockEncryptionService;
  let jwtService: MockJwtService;
  let useCase: Login;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    encryptionService = new MockEncryptionService();
    jwtService = new MockJwtService();
    useCase = new Login(credentialRepo, encryptionService, jwtService, new MockRbacService(), new MockGdgMemberService());
  });

  it("should return a jwt token for valid credentials", async () => {
    const email = "test@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email, 
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const token = await useCase.execute(email, password);
    expect(token).toBeDefined();
  });

  it("should throw an error for invalid credentials", async () => {
    const email = "test@example.com";
    await expect(useCase.execute(email, "password")).rejects.toThrow("No account found with the provided email address.");
  });
});
