import { InitiateCreateNewUser } from "./useCases/InitiateCreateNewUser";
import { FinalizeCreateNewUser } from "./useCases/FinalizeCreateNewUser";
import { Login } from "./useCases/Login";
import { VerifyToken } from "./useCases/VerifyToken";
import { InitiateChangePassword } from "./useCases/InitiateChangePassword";
import { FinalizeChangePassword } from "./useCases/FinalizeChangePassword";
import { InitiateChangeEmail } from "./useCases/InitiateChangeEmail";
import { FinalizeChangeEmail } from "./useCases/FinalizeChangeEmail";
import { DeleteUser } from "./useCases/DeleteUser";

export class AuthenticationController {
  constructor(
    private readonly initiateCreateNewUserUC: InitiateCreateNewUser,
    private readonly finalizeCreateNewUserUC: FinalizeCreateNewUser,
    private readonly loginUC: Login,
    private readonly verifyTokenUC: VerifyToken,
    private readonly initiateChangePasswordUC: InitiateChangePassword,
    private readonly finalizeChangePasswordUC: FinalizeChangePassword,
    private readonly initiateChangeEmailUC: InitiateChangeEmail,
    private readonly finalizeChangeEmailUC: FinalizeChangeEmail,
    private readonly deleteUserUC: DeleteUser
  ) {}

  async initiateCreateNewUser(body: { email: string; pass: string }): Promise<{ referenceCode: string }> {
    const referenceCode = await this.initiateCreateNewUserUC.execute(body.email, body.pass);
    return { referenceCode };
  }

  async finalizeCreateNewUser(body: { referenceCode: string; otp: string }): Promise<{ success: boolean }> {
    const success = await this.finalizeCreateNewUserUC.execute(body.referenceCode, body.otp);
    return { success };
  }

  async login(body: { email: string; pass: string }): Promise<{ token: string }> {
    const token = await this.loginUC.execute(body.email, body.pass);
    return { token };
  }

  async verifyToken(body: { token: string }): Promise<Record<string, any>> {
    return this.verifyTokenUC.execute(body.token);
  }

  async initiateChangePassword(body: { email: string; pass: string; newPass: string }): Promise<{ referenceCode: string }> {
    const referenceCode = await this.initiateChangePasswordUC.execute(body.email, body.pass, body.newPass);
    return { referenceCode };
  }

  async finalizeChangePassword(body: { referenceCode: string; otp: string }): Promise<{ success: boolean }> {
    const success = await this.finalizeChangePasswordUC.execute(body.referenceCode, body.otp);
    return { success };
  }

  async initiateChangeEmail(body: { email: string; pass: string; newEmail: string }): Promise<{ referenceCode: string }> {
    const referenceCode = await this.initiateChangeEmailUC.execute(body.email, body.pass, body.newEmail);
    return { referenceCode };
  }

  async finalizeChangeEmail(body: { referenceCode: string; otp: string }): Promise<{ success: boolean }> {
    const success = await this.finalizeChangeEmailUC.execute(body.referenceCode, body.otp);
    return { success };
  }

  async deleteUser(body: { email: string }): Promise<{ success: boolean }> {
    const success = await this.deleteUserUC.execute(body.email);
    return { success };
  }
}
