import { SupabaseClient } from "@supabase/supabase-js";
import { AuthenticationController } from "./AuthenticationController";
import { BcryptEncryptionService } from "./infrastructure/BcryptEncryptionService";
import { JwtService } from "./infrastructure/JwtService";
import { OtpService } from "./infrastructure/OtpService";
import { SupabaseUserCredentialRepository } from "./infrastructure/SupabaseUserCredentialRepository";
import { SupabaseUserCredentialReferenceRepository } from "./infrastructure/SupabaseUserCredentialReferenceRepository";
import { InitiateCreateNewUser } from "./useCases/InitiateCreateNewUser";
import { FinalizeCreateNewUser } from "./useCases/FinalizeCreateNewUser";
import { Login } from "./useCases/Login";
import { VerifyToken } from "./useCases/VerifyToken";
import { InitiateChangePassword } from "./useCases/InitiateChangePassword";
import { FinalizeChangePassword } from "./useCases/FinalizeChangePassword";
import { InitiateChangeEmail } from "./useCases/InitiateChangeEmail";
import { FinalizeChangeEmail } from "./useCases/FinalizeChangeEmail";
import { DeleteUser } from "./useCases/DeleteUser";

export function initializeAuthenticationModule(supabase: SupabaseClient, jwtSecret: string) {
  // Infrastructure
  const credentialRepo = new SupabaseUserCredentialRepository(supabase);
  const referenceRepo = new SupabaseUserCredentialReferenceRepository(supabase);
  const encryptionService = new BcryptEncryptionService();
  const jwtService = new JwtService(jwtSecret);
  const otpService = new OtpService();

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
