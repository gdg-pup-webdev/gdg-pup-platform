// import { describe, it, expect, beforeEach } from "vitest";
// import { Login } from "@/v1/modules/authentication/useCases/Login";
// import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository";
// import { MockEncryptionService } from "../infrastructure/MockEncryptionService";
// import { MockJwtService } from "../infrastructure/MockJwtService";
// import { UserCredential } from "@/v1/modules/authentication/domain/UserCredential";
// import { MockRbacService } from "../infrastructure/MockRbacService";
// import { MockGdgMemberRepository } from "../../gdgMembers/infrastructure/MockGdgMemberRepository";

// describe("Login", () => {
//   let credentialRepo: MockUserCredentialRepository;
//   let encryptionService: MockEncryptionService;
//   let jwtService: MockJwtService;
//   let useCase: Login;

//   beforeEach(() => {
//     credentialRepo = new MockUserCredentialRepository();
//     encryptionService = new MockEncryptionService();
//     jwtService = new MockJwtService();
//     useCase = new Login(credentialRepo, encryptionService, jwtService, new MockRbacService(), new MockGdgMemberRepository());
//   });

//   it("should return a jwt token for valid credentials", async () => {
//     const email = "test@example.com";
//     const password = "password";
//     const credential = UserCredential.create({
//       emailAddress: email, 
//       passwordHash: await encryptionService.hash(password),
//     });
//     await credentialRepo.saveNew(credential);

//     const token = await useCase.execute(email, password);
//     expect(token).toBe(JSON.stringify({ username: "test", email }));
//   });

//   it("should throw an error for invalid credentials", async () => {
//     await expect(useCase.execute("test@example.com", "password")).rejects.toThrow("Invalid credentials.");
//   });
// });


