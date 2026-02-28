import { Router } from "express";
import { AuthController, authController } from "./auth.controller.js";

export class AuthRouter {
  constructor(private readonly controller: AuthController = authController) {}

  getRouter(): Router {
    const router = Router();

    router.post("/verify", this.controller.verifyEmail);
    router.post("/signup", this.controller.signUp);
    router.post("/signin", this.controller.signIn);
    router.post("/oauth", this.controller.oauth);
    router.post("/logout", this.controller.signOut);
    router.post("/exchange", this.controller.exchange);
    router.get("/me", this.controller.getMe);

    return router;
  }
}

export const authRouterInstance = new AuthRouter();
