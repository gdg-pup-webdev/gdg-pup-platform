import { describe, it, expect, beforeEach } from "vitest";
import { MockUserCredentialRepository } from "../infrastructure/MockUserCredentialRepository";
import { NodeEncryptionService } from "../infrastructure/NodeEncryptionService";
import { NodeJWTService } from "../infrastructure/NodeJWTService";
import { CreateUser } from "../useCases/CreateUser";
import { DeleteUser } from "../useCases/DeleteUser";
import { Login } from "../useCases/Login";
import { VerifyToken } from "../useCases/VerifyToken";
import { GetPasswordChangeOtp } from "../useCases/GetPasswordChangeOtp";
import { GetChangeEmailOtp } from "../useCases/GetChangeEmailOtp";
import { ChangePassword } from "../useCases/ChangePassword";
import { ChangeEmail } from "../useCases/ChangeEmail";
import { AuthenticationController } from "../AuthenticationController";

describe("Authentication Module", () => {
  let repo: MockUserCredentialRepository;
  let encryption: NodeEncryptionService;
  let jwt: NodeJWTService;
  let controller: AuthenticationController;

  beforeEach(() => {
    repo = new MockUserCredentialRepository();
    encryption = new NodeEncryptionService();
    jwt = new NodeJWTService();
    
    controller = new AuthenticationController(
      new CreateUser(repo, encryption),
      new DeleteUser(repo),
      new Login(repo, encryption, jwt),
      new VerifyToken(jwt),
      new GetPasswordChangeOtp(repo),
      new GetChangeEmailOtp(repo),
      new ChangePassword(repo, encryption),
      new ChangeEmail(repo)
    );
  });

  it("should create a new user and login", async () => {
    const email = "test@example.com";
    const password = "securePassword123";

    await controller.createUser({ email, password });
    const loginResult = await controller.login({ email, password });

    expect(loginResult.token).toBeDefined();

    const verifyResult = (await controller.verifyToken({ token: loginResult.token })) as any;
    expect(verifyResult.email).toBe(email);
    expect(verifyResult.username).toBe("test");
  });

  it("should fail login with wrong password", async () => {
    const email = "test@example.com";
    await controller.createUser({ email, password: "correct" });

    await expect(controller.login({ email, password: "wrong" }))
      .rejects.toThrow("Invalid credentials.");
  });

  it("should change password with OTP", async () => {
    const email = "user@example.com";
    await controller.createUser({ email, password: "oldPassword" });

    const { otp } = await controller.getPasswordChangeOtp({ email });
    expect(otp).toBe("123456");

    await controller.changePassword({ email, newPassword: "newPassword", otp });

    const loginResult = await controller.login({ email, password: "newPassword" });
    expect(loginResult.token).toBeDefined();

    await expect(controller.login({ email, password: "oldPassword" }))
      .rejects.toThrow("Invalid credentials.");
  });

  it("should change email with OTP", async () => {
    const oldEmail = "old@example.com";
    const newEmail = "new@example.com";
    await controller.createUser({ email: oldEmail, password: "password" });

    const { otp } = await controller.getChangeEmailOtp({ email: oldEmail });
    await controller.changeEmail({ email: oldEmail, newEmail, otp });

    const loginResult = await controller.login({ email: newEmail, password: "password" });
    expect(loginResult.token).toBeDefined();

    await expect(controller.login({ email: oldEmail, password: "password" }))
      .rejects.toThrow("Invalid credentials.");
  });

  it("should delete a user", async () => {
    const email = "delete@me.com";
    await controller.createUser({ email, password: "pw" });
    await controller.deleteUser({ email });

    await expect(controller.login({ email, password: "pw" }))
      .rejects.toThrow("Invalid credentials.");
  });
});
