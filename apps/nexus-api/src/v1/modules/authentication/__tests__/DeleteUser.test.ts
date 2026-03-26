import { describe, it, expect, beforeEach } from "vitest"; 
import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository.js"; 
import { MockEncryptionService } from "../infrastructure/MockEncryptionService.js";
import { UserCredential } from "../domain/UserCredential.js";
import { DeleteUser } from "../useCases/DeleteUser.js";

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
      passwordHash: await encryptionService.hash(password),
    });
    await credentialRepo.saveNew(credential);

    const result = await useCase.execute(email);
    expect(result).toBe(true);

    const deletedCredential = await credentialRepo.findByEmail(email);
    expect(deletedCredential).toBeNull();
  });
});


