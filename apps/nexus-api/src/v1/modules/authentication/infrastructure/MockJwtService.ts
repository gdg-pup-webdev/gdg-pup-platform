import { IJWTService } from "../domain/IAuthenticationInterfaces.js";
import { TokenPayload } from "../domain/TokenPayload.js";

export class MockJwtService implements IJWTService {
  async sign(payload: TokenPayload): Promise<string> {
    return Promise.resolve(JSON.stringify(payload));
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      return Promise.resolve(JSON.parse(token));
    } catch (e) {
      throw new Error("Invalid token");
    }
  }
}

