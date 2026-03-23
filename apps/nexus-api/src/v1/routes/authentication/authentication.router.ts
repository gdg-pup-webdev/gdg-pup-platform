import { Router } from "express";
import { AuthenticationHttpController } from "./authentication.controller";

export class AuthenticationRouter {
  router: Router;

  constructor(private readonly controller: AuthenticationHttpController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup/initiate", this.controller.initiateCreateNewUser);
    this.router.post("/signup/finalize", this.controller.finalizeCreateNewUser);
    this.router.post("/login", this.controller.login);
    this.router.post("/verify", this.controller.verifyToken);
    this.router.get("/me", this.controller.getMe);
    this.router.post("/logout", this.controller.logout);
    
    this.router.post("/password/change/initiate", this.controller.initiateChangePassword);

    this.router.post("/password/change/finalize", this.controller.finalizeChangePassword);
    
    this.router.post("/email/change/initiate", this.controller.initiateChangeEmail);
    this.router.post("/email/change/finalize", this.controller.finalizeChangeEmail);
    
    this.router.delete("/user", this.controller.deleteUser);
  }
}