import { CreateUserUseCase } from "./useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "./useCases/DeleteUserUseCase";
import { ChangeUsernameUseCase } from "./useCases/ChangeUsernameUseCase";
import { ChangePasswordUseCase } from "./useCases/ChangePasswordUseCase";
import { LoginUseCase } from "./useCases/LoginUseCase";
import { VerifyTokenUseCase } from "./useCases/VerifyTokenUseCase";

export class CustomAuthModuleController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changeUsernameUseCase: ChangeUsernameUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase
  ) {}

  async createUser(username: string, passwordRaw: string) {
    const user = await this.createUserUseCase.execute(username, passwordRaw);
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async deleteUser(username: string) {
    return await this.deleteUserUseCase.execute(username);
  }

  async changeUsername(currentUsername: string, newUsername: string, passwordRaw: string) {
    const user = await this.changeUsernameUseCase.execute(currentUsername, newUsername, passwordRaw);
    return {
      id: user.id,
      username: user.username,
    };
  }

  async changePassword(username: string, newPasswordRaw: string, oldPasswordRaw: string) {
    await this.changePasswordUseCase.execute(username, newPasswordRaw, oldPasswordRaw);
    return { success: true };
  }

  async login(username: string, passwordRaw: string) {
    const { user, token } = await this.loginUseCase.execute(username, passwordRaw);
    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }

  async verifyToken(token: string) {
    return await this.verifyTokenUseCase.execute(token);
  }
}
