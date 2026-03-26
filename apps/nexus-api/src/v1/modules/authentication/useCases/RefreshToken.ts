import { IJWTService } from "../domain/IAuthenticationInterfaces.js";

export class RefreshToken {
  constructor(private readonly jwtService: IJWTService) {}

  async execute(token: string) {
    const payload = await this.jwtService.verify(token);

    if (payload) {
      const newToken = await this.jwtService.sign(payload);
      return newToken;
    }

    throw new Error(
      "Cannot refresh invalid token. It is either malformed or expired.",
    );
  }
}
