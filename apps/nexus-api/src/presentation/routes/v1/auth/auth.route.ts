import { Router } from "express";
import { AuthHttpController } from "./auth.controller.js";

export class AuthRouter {
  router: Router;

  constructor(private readonly controller: AuthHttpController) {
    this.router = Router();

    this.router.post("/verify", this.controller.verifyEmail);
    this.router.post("/signup", this.controller.signUp);
    this.router.post("/signin", this.controller.signIn);
    this.router.post("/oauth", this.controller.oauth);
    this.router.post("/logout", this.controller.signOut);
    this.router.post("/exchange", this.controller.exchange);
    this.router.get("/me", this.controller.getMe);
  }
}
