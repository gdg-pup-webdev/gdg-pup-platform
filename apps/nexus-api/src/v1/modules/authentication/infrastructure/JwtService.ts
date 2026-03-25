import { IJWTService } from "../domain/IAuthenticationInterfaces.js";
import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../domain/TokenPayload.js";

export class JwtService implements IJWTService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = "1h",
  ) {}

  async sign(payload: TokenPayload): Promise<string> {
    console.log("creating jwt token with payload", payload.props);
    return jwt.sign(payload.props, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  async verify(token: string): Promise<Record<string, any>> {
    return jwt.verify(token, this.secret) as Record<string, any>;
  }
}
