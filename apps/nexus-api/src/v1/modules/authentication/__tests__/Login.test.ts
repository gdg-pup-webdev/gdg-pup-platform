import { describe, it, expect, beforeEach } from "vitest";
import { Login } from "../../useCases/Login";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";
import { MockJwtService } from "./__mocks__/MockJwtService";
import { UserCredential } from "../../domain/UserCredential";

describe("Login", () => {
  let credentialRepo: MockUserCredentialRepository;
  let encryptionService: MockEncryptionService;
  let jwtService: MockJwtService;
  let useCase: Login;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    encryptionService = new MockEncryptionService();
    jwtService = new MockJwtService();
    useCase = new Login(credentialRepo, encryptionService, jwtService);
  });

  it("should return a jwt token for valid credentials", async () => {
    const email = "test@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email,
      username: "test",
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const token = await useCase.execute(email, password);
    expect(token).toBe(JSON.stringify({ username: "test", email }));
  });

  it("should throw an error for invalid credentials", async () => {
    await expect(useCase.execute("test@example.com", "password")).rejects.toThrow("Invalid credentials.");
  });
});
