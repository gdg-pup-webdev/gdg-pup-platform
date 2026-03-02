import { AuthService } from "@/modules/authSystem";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class AuthHttpController {
  constructor(private readonly service: AuthService) {}

  verifyEmail: RequestHandler = createExpressController(
    contract.api.auth_system.verify.POST,
    async ({ input, output }) => {
      const { token_hash, type } = input.body.data;

      const result = await this.service.verifyEmail(token_hash, type);

      return output(200, {
        status: "success",
        message: "Email verified successfully",
        data: {
          success: true,
          user: result.user,
          session: result.session,
        },
      });
    },
  );

  signUp: RequestHandler = createExpressController(
    contract.api.auth_system.signup.POST,
    async ({ input, output }) => {
      const { email, password, display_name } = input.body.data;
      const result = await this.service.signUp(email, password, display_name);
      return output(201, {
        status: "success",
        message:
          "Sign up successful. Please check your email for verification.",
        data: {
          success: true,
          user: result.user,
          session: result.session,
        },
      });
    },
  );

  signIn: RequestHandler = createExpressController(
    contract.api.auth_system.signin.POST,
    async ({ input, output }) => {
      const { email, password } = input.body.data;
      const result = await this.service.signIn(email, password);
      return output(200, {
        status: "success",
        message: "Sign in successful",
        data: {
          success: true,
          user: result.user,
          session: result.session,
        },
      });
    },
  );

  signOut: RequestHandler = createExpressController(
    contract.api.auth_system.logout.POST,
    async ({ output, ctx }) => {
      const authHeader = ctx.req.headers.authorization;

      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        try {
          await this.service.signOut(token);
        } catch (error) {
          // Ignore errors during logout (e.g. invalid token)
          console.warn("Error during logout:", error);
        }
      }

      return output(200, {
        status: "success",
        message: "Signed out successfully",
        data: {
          success: true,
          message: "Signed out successfully",
        },
      });
    },
  );

  oauth: RequestHandler = createExpressController(
    contract.api.auth_system.oauth.POST,
    async ({ input, output }) => {
      const { provider, redirect_url } = input.body.data;
      const result = await this.service.signInWithOAuth(provider, redirect_url);
      return output(200, {
        status: "success",
        message: "OAuth initiated",
        data: {
          url: result.url,
        },
      });
    },
  );

  exchange: RequestHandler = createExpressController(
    contract.api.auth_system.exchange.POST,
    async ({ input, output }) => {
      const payload = input.body.data;
      const result = await this.service.exchangeCode(payload);
      return output(200, {
        status: "success",
        message: "Code exchanged successfully",
        data: {
          success: true,
          user: result.user,
          session: result.session,
        },
      });
    },
  );

  getMe: RequestHandler = createExpressController(
    contract.api.auth_system.me.GET,
    async ({ ctx, output }) => {
      const token = ctx.req.headers.authorization?.split(" ")[1];

      if (!token) {
        return output(401, {
          status: "error",
          message: "Unauthorized - No token provided",
        });
      }

      try {
        const result = await this.service.getUser(token);
        return output(200, {
          status: "success",
          message: "User retrieved",
          data: {
            success: true,
            user: result.user,
          },
        });
      } catch (error) {
        return output(401, {
          status: "error",
          message: "Unauthorized - Invalid token",
        });
      }
    },
  );
}
