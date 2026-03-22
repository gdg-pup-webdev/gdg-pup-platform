import { describe, it, expect, beforeEach } from "vitest";
import { AuthenticationController } from "../../AuthenticationController";
import { InitiateCreateNewUser } from "../../useCases/InitiateCreateNewUser";
import { FinalizeCreateNewUser } from "../../useCases/FinalizeCreateNewUser";
import { Login } from "../../useCases/Login";
import { VerifyToken } from "../../useCases/VerifyToken";
import { InitiateChangePassword } from "../../useCases/InitiateChangePassword";
import { FinalizeChangePassword } from "../../useCases/FinalizeChangePassword";
import { InitiateChangeEmail } from "../../useCases/InitiateChangeEmail";
import { FinalizeChangeEmail } from "../../useCases/FinalizeChangeEmail";
import { DeleteUser } from "../../useCases/DeleteUser";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockUserCredentialReferenceRepository } from "./__mocks__/MockUserCredentialReferenceRepository";
import { MockEncryptionService } from "./__mocks__/MockEncryptionService";
import { MockJwtService } from "./__mocks__/MockJwtService";
import { MockOtpService } from "./__mocks__/MockOtpService";

describe("AuthenticationController", () => {
  let controller: AuthenticationController;

  beforeEach(() => {
    const credentialRepo = new MockUserCredentialRepository();
    const referenceRepo = new MockUserCredentialReferenceRepository();
    const encryptionService = new MockEncryptionService();
    const jwtService = new MockJwtService();
    const otpService = new MockOtpService();

    const initiateCreateNewUserUC = new InitiateCreateNewUser(referenceRepo, encryptionService, otpService);
    const finalizeCreateNewUserUC = new FinalizeCreateNewUser(credentialRepo, referenceRepo, otpService);
    const loginUC = new Login(credentialRepo, encryptionService, jwtService);
    const verifyTokenUC = new VerifyToken(jwtService);
    const initiateChangePasswordUC = new InitiateChangePassword(credentialRepo, referenceRepo, encryptionService, otpService);
    const finalizeChangePasswordUC = new FinalizeChangePassword(credentialRepo, referenceRepo, otpService);
    const initiateChangeEmailUC = new InitiateChangeEmail(credentialRepo, referenceRepo, encryptionService, otpService);
    const finalizeChangeEmailUC = new FinalizeChangeEmail(credentialRepo, referenceRepo, otpService);
    const deleteUserUC = new DeleteUser(credentialRepo);

    controller = new AuthenticationController(
      initiateCreateNewUserUC,
      finalizeCreateNewUserUC,
      loginUC,
      verifyTokenUC,
      initiateChangePasswordUC,
      finalizeChangePasswordUC,
      initiateChangeEmailUC,
      finalizeChangeEmailUC,
      deleteUserUC
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // Add more tests for each controller method
});
