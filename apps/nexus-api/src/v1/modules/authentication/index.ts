import { AuthenticationController } from "./AuthenticationController.js";
import { BcryptEncryptionService } from "./infrastructure/BcryptEncryptionService.js";
import { JwtService } from "./infrastructure/JwtService.js";
import { OtpService } from "./infrastructure/OtpService.js";
import { SupabaseUserCredentialRepository } from "./infrastructure/SupabaseUserCredentialRepository.js";
import { SupabaseUserCredentialReferenceRepository } from "./infrastructure/SupabaseUserCredentialReferenceRepository.js";
import { MemberCheckService } from "./infrastructure/MemberCheckService.js";
import { RbacService } from "./infrastructure/RbacService.js";
import { GdgMemberService } from "./infrastructure/GdgMemberService.js";
import { InitiateCreateNewUser } from "./useCases/InitiateCreateNewUser.js";
import { FinalizeCreateNewUser } from "./useCases/FinalizeCreateNewUser.js";
import { Login } from "./useCases/Login.js";
import { VerifyToken } from "./useCases/VerifyToken.js";
import { InitiateChangePassword } from "./useCases/InitiateChangePassword.js";
import { FinalizeChangePassword } from "./useCases/FinalizeChangePassword.js";
import { InitiateChangeEmail } from "./useCases/InitiateChangeEmail.js";
import { FinalizeChangeEmail } from "./useCases/FinalizeChangeEmail.js";
import { DeleteUser } from "./useCases/DeleteUser.js";
import { GetMe } from "./useCases/GetMe.js";
import { Logout } from "./useCases/Logout.js";
import { supabase } from "@/v1/lib/supabase.js";
import { configs } from "@/configs/configs.js";
import { oneTimePinController } from "../oneTimePin/index.js";
import { gdgMembersController } from "../members/index.js";
import { rbacController } from "../rbacSystem/index.js";
import { TokenPayloadProps } from "./domain/TokenPayload";
import { RefreshToken } from "./useCases/RefreshToken.js";
import { InitiateForgotPassword } from "./useCases/InitiateForgotPassword.js";
import { FinalizeForgotPassword } from "./useCases/FinalizeForgotPassword.js";
import { ResendOtp } from "./useCases/ResendOtp.js";

// Infrastructure
const credentialRepo = new SupabaseUserCredentialRepository(supabase);
const referenceRepo = new SupabaseUserCredentialReferenceRepository(supabase);
const encryptionService = new BcryptEncryptionService();
const jwtService = new JwtService(configs.jwt.secret);
const otpService = new OtpService(oneTimePinController);
const memberCheckService = new MemberCheckService(gdgMembersController);
const rbacService = new RbacService(rbacController);
const gdgMemberService = new GdgMemberService(gdgMembersController);

// Use Cases
const initiateCreateNewUserUC = new InitiateCreateNewUser(
  referenceRepo,
  encryptionService,
  otpService,
  memberCheckService,
  credentialRepo,
);
const finalizeCreateNewUserUC = new FinalizeCreateNewUser(
  credentialRepo,
  referenceRepo,
  otpService,
);
const loginUC = new Login(
  credentialRepo,
  encryptionService,
  jwtService,
  rbacService,
  gdgMemberService,
);
const verifyTokenUC = new VerifyToken(jwtService);
const getMeUC = new GetMe(verifyTokenUC, credentialRepo);
const logoutUC = new Logout();
const initiateChangePasswordUC = new InitiateChangePassword(
  credentialRepo,
  referenceRepo,
  encryptionService,
  otpService,
);
const finalizeChangePasswordUC = new FinalizeChangePassword(
  credentialRepo,
  referenceRepo,
  otpService,
);
const initiateForgotPasswordUC = new InitiateForgotPassword(
  credentialRepo,
  referenceRepo,
  otpService,
);
const finalizeForgotPasswordUC = new FinalizeForgotPassword(
  credentialRepo,
  referenceRepo,
  encryptionService,
  otpService,
);
const initiateChangeEmailUC = new InitiateChangeEmail(
  credentialRepo,
  referenceRepo,
  encryptionService,
  otpService,
);
const finalizeChangeEmailUC = new FinalizeChangeEmail(
  credentialRepo,
  referenceRepo,
  otpService,
);
const deleteUserUC = new DeleteUser(credentialRepo);
const refreshTokenUC = new RefreshToken(verifyTokenUC, jwtService, rbacService, gdgMemberService);
const resendOtpUC = new ResendOtp(referenceRepo, otpService);

// Controller
export const authenticationController = new AuthenticationController(
  initiateCreateNewUserUC,
  finalizeCreateNewUserUC,
  loginUC,
  verifyTokenUC,
  getMeUC,
  logoutUC,
  initiateChangePasswordUC,
  finalizeChangePasswordUC,
  initiateChangeEmailUC,
  finalizeChangeEmailUC,
  deleteUserUC,
  refreshTokenUC,
  initiateForgotPasswordUC,
  finalizeForgotPasswordUC,
  resendOtpUC,
);

export { AuthenticationController, type TokenPayloadProps };
