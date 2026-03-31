import { RequestHandler } from "express";
import { AuthenticationController as AuthModuleController } from "@/v1/modules/authentication/AuthenticationController.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";

export class AuthenticationHttpController {
  constructor(private readonly moduleController: AuthModuleController) {}

  public refreshToken: RequestHandler = createExpressController(
    contract.api.v1.authentication.refresh.POST,
    async ({ input, output }) => {
      const { token } = input.body.data;
      const newToken = await this.moduleController.refreshToken(token);
      
      return output(200, {
        status: "success",
        message: "Token refreshed successfully",
        data: newToken,
      });
    }
  );

  public initiateCreateNewUser: RequestHandler = createExpressController(
    contract.api.v1.authentication.signup.initiate.POST,
    async ({ input, output }) => {
      const { email, pass } = input.body.data;
      const result = await this.moduleController.initiateCreateNewUser({ email, pass });
      
      return output(200, {
        status: "success",
        message: "Signup initiated",
        data: result,
      });
    }
  );

  public finalizeCreateNewUser: RequestHandler = createExpressController(
    contract.api.v1.authentication.signup.finalize.POST,
    async ({ input, output }) => {
      const { referenceCode, otp } = input.body.data;
      const result = await this.moduleController.finalizeCreateNewUser({ referenceCode, otp });
      
      return output(200, {
        status: "success",
        message: "Signup finalized",
        data: result,
      });
    }
  );

  public login: RequestHandler = createExpressController(
    contract.api.v1.authentication.login.POST,
    async ({ input, output }) => {
      const { email, pass } = input.body.data;
      const result = await this.moduleController.login({ email, pass });
      
      return output(200, {
        status: "success",
        message: "Login successful",
        data: result,
      });
    }
  );

  public verifyToken: RequestHandler = createExpressController(
    contract.api.v1.authentication.verify.POST,
    async ({ input, output, ctx }) => {
      const token = ctx.req.headers.authorization?.replace("Bearer ", "") || input.body.data.token;
      if (!token) throw new Error("No token provided");
      
      const result = await this.moduleController.verifyToken({ token });
      
      return output(200, {
        status: "success",
        message: "Token is valid",
        data: true,
      });
    }
  );

  public getMe: RequestHandler = createExpressController(
    contract.api.v1.authentication.me.GET,
    async ({ output, ctx }) => {
      const token = ctx.req.headers.authorization?.replace("Bearer ", "");
      if (!token) throw new Error("No token provided");
      
      const result = await this.moduleController.getMe({ token });
      
      return output(200, {
        status: "success",
        message: "User retrieved",
        data: result,
      });
    }
  );

  public logout: RequestHandler = createExpressController(
    contract.api.v1.authentication.logout.POST,
    async ({ output }) => {
      const result = await this.moduleController.logout();
      
      return output(200, {
        status: "success",
        message: "Logged out successfully",
        data: result,
      });
    }
  );


  public initiateChangePassword: RequestHandler = createExpressController(
    contract.api.v1.authentication.password.change.initiate.POST,
    async ({ input, output }) => {
      const { email, pass, newPass } = input.body.data;
      const result = await this.moduleController.initiateChangePassword({ email, pass, newPass });
      
      return output(200, {
        status: "success",
        message: "Password change initiated",
        data: result,
      });
    }
  );

  public finalizeChangePassword: RequestHandler = createExpressController(
    contract.api.v1.authentication.password.change.finalize.POST,
    async ({ input, output }) => {
      const { referenceCode, otp } = input.body.data;
      const result = await this.moduleController.finalizeChangePassword({ referenceCode, otp });
      
      return output(200, {
        status: "success",
        message: "Password changed successfully",
        data: result,
      });
    }
  );

  public initiateForgotPassword: RequestHandler = createExpressController(
    contract.api.v1.authentication.password.forgot.initiate.POST,
    async ({ input, output }) => {
      const { email } = input.body.data;
      const result = await this.moduleController.initiateForgotPassword({ email });
      
      return output(200, {
        status: "success",
        message: "Forgot password initiated",
        data: result,
      });
    }
  );

  public finalizeForgotPassword: RequestHandler = createExpressController(
    contract.api.v1.authentication.password.forgot.finalize.POST,
    async ({ input, output }) => {
      const { referenceCode, otp, newPass } = input.body.data;
      const result = await this.moduleController.finalizeForgotPassword({ referenceCode, otp, newPass });
      
      return output(200, {
        status: "success",
        message: "Password reset successfully",
        data: result,
      });
    }
  );

  public resendOtp: RequestHandler = createExpressController(
    contract.api.v1.authentication.otp.resend.POST,
    async ({ input, output }) => {
      const { referenceCode } = input.body.data;
      const result = await this.moduleController.resendOtp({ referenceCode });
      
      return output(200, {
        status: "success",
        message: "OTP resent successfully",
        data: result,
      });
    }
  );

  public initiateChangeEmail: RequestHandler = createExpressController(
    contract.api.v1.authentication.email.change.initiate.POST,
    async ({ input, output }) => {
      const { email, pass, newEmail } = input.body.data;
      if (!email) throw new Error("Email must be provided");
      
      const result = await this.moduleController.initiateChangeEmail({ email, pass, newEmail });
      
      return output(200, {
        status: "success",
        message: "Email change initiated",
        data: result,
      });
    }
  );

  public finalizeChangeEmail: RequestHandler = createExpressController(
    contract.api.v1.authentication.email.change.finalize.POST,
    async ({ input, output }) => {
      const { referenceCode, otp } = input.body.data;
      const result = await this.moduleController.finalizeChangeEmail({ referenceCode, otp });
      
      return output(200, {
        status: "success",
        message: "Email changed successfully",
        data: result,
      });
    }
  );

  public deleteUser: RequestHandler = createExpressController(
    contract.api.v1.authentication.user.DELETE,
    async ({ input, output }) => {
      const { email } = input.body.data;
      if (!email) throw new Error("Email must be provided");
      
      const result = await this.moduleController.deleteUser({ email });
      
      return output(200, {
        status: "success",
        message: "User deleted successfully",
        data: result,
      });
    }
  );
}
