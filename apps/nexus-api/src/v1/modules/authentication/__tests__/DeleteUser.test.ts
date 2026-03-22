import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUser } from "../../useCases/DeleteUser";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { UserCredential } from "../../domain/UserCredential";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";

describe("DeleteUser", () => {
  let credentialRepo: MockUserCredentialRepository;
  let useCase: DeleteUser;
  let encryptionService: MockEncryptionService;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    encryptionService = new MockEncryptionService();
    useCase = new DeleteUser(credentialRepo);
  });

  it("should delete a user", async () => {
    const email = "test@example.com";
    const password = "password";
    const credential = UserCredential.create({
      emailAddress: email,
      username: "test",
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const result = await useCase.execute(email);
    expect(result).toBe(true);

    const deletedCredential = await credentialRepo.findByEmail(email);
    expect(deletedCredential).toBeNull();
  });
});
