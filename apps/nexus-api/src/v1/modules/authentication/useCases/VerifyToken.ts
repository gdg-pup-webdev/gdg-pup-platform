import { IJWTService } from "../domain/IAuthenticationInterfaces";

export class VerifyToken {
  constructor(private readonly jwt: IJWTService) {}
  async execute(token: string): Promise<Record<string, any> | null> {
    try {
      return await this.jwt.verify(token);
    } catch {
      return null;
    }
  }
}
