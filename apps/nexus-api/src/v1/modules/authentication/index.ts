import { SupabaseUserCredentialRepository } from "./infrastructure/SupabaseUserCredentialRepository";
import { NodeEncryptionService } from "./infrastructure/NodeEncryptionService";
import { NodeJWTService } from "./infrastructure/NodeJWTService";
import { CreateUser } from "./useCases/CreateUser";
import { DeleteUser } from "./useCases/DeleteUser";
import { Login } from "./useCases/Login";
import { VerifyToken } from "./useCases/VerifyToken";
import { GetPasswordChangeOtp } from "./useCases/GetPasswordChangeOtp";
import { GetChangeEmailOtp } from "./useCases/GetChangeEmailOtp";
import { ChangePassword } from "./useCases/ChangePassword";
import { ChangeEmail } from "./useCases/ChangeEmail";
import { AuthenticationController } from "./AuthenticationController";

const repo = new SupabaseUserCredentialRepository();
const encryption = new NodeEncryptionService();
const jwt = new NodeJWTService();

const createUserUC = new CreateUser(repo, encryption);
const deleteUserUC = new DeleteUser(repo);
const loginUC = new Login(repo, encryption, jwt);
const verifyTokenUC = new VerifyToken(jwt);
const getPasswordOtpUC = new GetPasswordChangeOtp(repo);
const getEmailOtpUC = new GetChangeEmailOtp(repo);
const changePasswordUC = new ChangePassword(repo, encryption);
const changeEmailUC = new ChangeEmail(repo);

export const authenticationController = new AuthenticationController(
  createUserUC,
  deleteUserUC,
  loginUC,
  verifyTokenUC,
  getPasswordOtpUC,
  getEmailOtpUC,
  changePasswordUC,
  changeEmailUC
);

export { AuthenticationController };
export * from "./domain/User";
export * from "./domain/IAuthenticationInterfaces";
export * from "./useCases/CreateUser";
export * from "./useCases/DeleteUser";
export * from "./useCases/Login";
export * from "./useCases/VerifyToken";
export * from "./useCases/GetPasswordChangeOtp";
export * from "./useCases/GetChangeEmailOtp";
export * from "./useCases/ChangePassword";
export * from "./useCases/ChangeEmail";
