import { CustomAuthModuleController } from "./CustomAuthModuleController";
import { SupabaseCustomAuthRepository } from "./infrastructure/SupabaseCustomAuthRepository";
import { BCryptEncryptionService } from "./infrastructure/BCryptEncryptionService";
import { JWTService } from "./infrastructure/JWTService";
import { CreateUserUseCase } from "./useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "./useCases/DeleteUserUseCase";
import { ChangeUsernameUseCase } from "./useCases/ChangeUsernameUseCase";
import { ChangePasswordUseCase } from "./useCases/ChangePasswordUseCase";
import { LoginUseCase } from "./useCases/LoginUseCase";
import { VerifyTokenUseCase } from "./useCases/VerifyTokenUseCase";

// Real production infrastructure
const repository = new SupabaseCustomAuthRepository();
const encryptionService = new BCryptEncryptionService();
const jwtService = new JWTService();

const createUserUseCase = new CreateUserUseCase(repository, encryptionService);
const deleteUserUseCase = new DeleteUserUseCase(repository);
const changeUsernameUseCase = new ChangeUsernameUseCase(repository, encryptionService);
const changePasswordUseCase = new ChangePasswordUseCase(repository, encryptionService);
const loginUseCase = new LoginUseCase(repository, encryptionService, jwtService);
const verifyTokenUseCase = new VerifyTokenUseCase(jwtService, repository);

export const customAuthModuleController = new CustomAuthModuleController(
  createUserUseCase,
  deleteUserUseCase,
  changeUsernameUseCase,
  changePasswordUseCase,
  loginUseCase,
  verifyTokenUseCase
);

export * from "./CustomAuthModuleController";
export * from "./domain/User";
export * from "./domain/Interfaces";
