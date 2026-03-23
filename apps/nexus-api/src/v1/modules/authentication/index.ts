import { SupabaseClient } from "@supabase/supabase-js";
import { AuthenticationController } from "./AuthenticationController.js";
import { BcryptEncryptionService } from "./infrastructure/BcryptEncryptionService.js";
import { JwtService } from "./infrastructure/JwtService.js";
import { OtpService } from "./infrastructure/OtpService.js";
import { SupabaseUserCredentialRepository } from "./infrastructure/SupabaseUserCredentialRepository.js";
import { SupabaseUserCredentialReferenceRepository } from "./infrastructure/SupabaseUserCredentialReferenceRepository.js";
import { InitiateCreateNewUser } from "./useCases/InitiateCreateNewUser.js";
import { FinalizeCreateNewUser } from "./useCases/FinalizeCreateNewUser.js";
import { Login } from "./useCases/Login.js";
import { VerifyToken } from "./useCases/VerifyToken.js";
import { InitiateChangePassword } from "./useCases/InitiateChangePassword.js";
import { FinalizeChangePassword } from "./useCases/FinalizeChangePassword.js";
import { InitiateChangeEmail } from "./useCases/InitiateChangeEmail.js";
import { FinalizeChangeEmail } from "./useCases/FinalizeChangeEmail.js";
import { DeleteUser } from "./useCases/DeleteUser.js";
import { OneTimePinController } from "../oneTimePin/OneTimePinController.js";

export function initializeAuthenticationModule(supabase: SupabaseClient, jwtSecret: string, oneTimePinController: OneTimePinController) {
  // Infrastructure
  const credentialRepo = new SupabaseUserCredentialRepository(supabase);
  const referenceRepo = new SupabaseUserCredentialReferenceRepository(supabase);
  const encryptionService = new BcryptEncryptionService();
  const jwtService = new JwtService(jwtSecret);
  const otpService = new OtpService(oneTimePinController);

  // Use Cases
  const initiateCreateNewUserUC = new InitiateCreateNewUser(referenceRepo, encryptionService, otpService);
  const finalizeCreateNewUserUC = new FinalizeCreateNewUser(credentialRepo, referenceRepo, otpService);
  const loginUC = new Login(credentialRepo, encryptionService, jwtService);
  const verifyTokenUC = new VerifyToken(jwtService);
  const initiateChangePasswordUC = new InitiateChangePassword(credentialRepo, referenceRepo, encryptionService, otpService);
  const finalizeChangePasswordUC = new FinalizeChangePassword(credentialRepo, referenceRepo, otpService);
  const initiateChangeEmailUC = new InitiateChangeEmail(credentialRepo, referenceRepo, encryptionService, otpService);
  const finalizeChangeEmailUC = new FinalizeChangeEmail(credentialRepo, referenceRepo, otpService);
  const deleteUserUC = new DeleteUser(credentialRepo);

  // Controller
  const controller = new AuthenticationController(
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

  return controller;
}

export {
    AuthenticationController,
    InitiateCreateNewUser,
    FinalizeCreateNewUser,
    Login,
    VerifyToken,
    InitiateChangePassword,
    FinalizeChangePassword,
    InitiateChangeEmail,
    FinalizeChangeEmail,
    DeleteUser
}

