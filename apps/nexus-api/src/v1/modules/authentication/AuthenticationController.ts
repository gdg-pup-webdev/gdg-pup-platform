import { CreateUser } from "./useCases/CreateUser";
import { DeleteUser } from "./useCases/DeleteUser";
import { Login } from "./useCases/Login";
import { VerifyToken } from "./useCases/VerifyToken";
import { GetPasswordChangeOtp } from "./useCases/GetPasswordChangeOtp";
import { GetChangeEmailOtp } from "./useCases/GetChangeEmailOtp";
import { ChangePassword } from "./useCases/ChangePassword";
import { ChangeEmail } from "./useCases/ChangeEmail";

export class AuthenticationController {
  constructor(
    private readonly createUserUC: CreateUser,
    private readonly deleteUserUC: DeleteUser,
    private readonly loginUC: Login,
    private readonly verifyTokenUC: VerifyToken,
    private readonly getPasswordOtpUC: GetPasswordChangeOtp,
    private readonly getEmailOtpUC: GetChangeEmailOtp,
    private readonly changePasswordUC: ChangePassword,
    private readonly changeEmailUC: ChangeEmail
  ) {}

  async createUser(data: { email: string; password: string }) {
    const result = await this.createUserUC.execute(data.email, data.password);
    return { id: result.props.id, email: result.props.emailAddress };
  }

  async deleteUser(data: { email: string }) {
    await this.deleteUserUC.execute(data.email);
    return { success: true };
  }

  async login(data: { email: string; password: string }) {
    const token = await this.loginUC.execute(data.email, data.password);
    return { token };
  }

  async verifyToken(data: { token: string }) {
    const payload = this.verifyTokenUC.execute(data.token);
    if (!payload) throw new Error("Invalid token.");
    return payload;
  }

  async getPasswordChangeOtp(data: { email: string }) {
    const otp = await this.getPasswordOtpUC.execute(data.email);
    return { otp };
  }

  async getChangeEmailOtp(data: { email: string }) {
    const otp = await this.getEmailOtpUC.execute(data.email);
    return { otp };
  }

  async changePassword(data: { email: string; newPassword: string; otp: string }) {
    await this.changePasswordUC.execute(data.email, data.newPassword, data.otp);
    return { success: true };
  }

  async changeEmail(data: { email: string; newEmail: string; otp: string }) {
    await this.changeEmailUC.execute(data.email, data.newEmail, data.otp);
    return { success: true };
  }
}
