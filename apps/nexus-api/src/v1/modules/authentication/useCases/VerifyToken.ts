import { IJWTService } from "../domain/IAuthenticationInterfaces";

export class VerifyToken {
  constructor(private readonly jwtService: IJWTService) {}

  async execute(token: string): Promise<Record<string, any>> {
    const payload = await this.jwtService.verify(token);
    return payload;
  }
}
