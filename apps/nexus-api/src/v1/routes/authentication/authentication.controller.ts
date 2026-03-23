import { RequestHandler } from "express";
import { AuthenticationController as AuthModuleController } from "@/v1/modules/authentication/AuthenticationController.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";

export class AuthenticationHttpController {
  constructor(private readonly moduleController: AuthModuleController) {}

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
