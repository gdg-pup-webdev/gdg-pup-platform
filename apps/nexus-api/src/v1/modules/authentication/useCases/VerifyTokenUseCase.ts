import { IJWTService, ICustomAuthRepository } from "../domain/Interfaces";

export class VerifyTokenUseCase {
  constructor(
    private readonly jwtService: IJWTService,
    private readonly repository: ICustomAuthRepository
  ) {}

  async execute(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      if (!payload || !payload.username) {
        console.error("[VerifyTokenUseCase] Invalid payload or missing username", payload);
        return null;
      }

      console.log("[VerifyTokenUseCase] Token verified for username:", payload.username);

      const user = await this.repository.findByUsername(payload.username);
      if (!user) {
        console.error(`[VerifyTokenUseCase] User not found for username: ${payload.username}`);
        return null;
      }

      return {
        id: user.id,
        username: user.username,
      };
    } catch (error: any) {
      console.error("[VerifyTokenUseCase] Unexpected error:", error.message, error.stack);
      return null;
    }
  }
}
