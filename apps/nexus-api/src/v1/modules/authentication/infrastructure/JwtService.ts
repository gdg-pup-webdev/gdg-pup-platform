import { IJWTService } from "../domain/IAuthenticationInterfaces.js";
import * as jwt from "jsonwebtoken";

export class JwtService implements IJWTService {
  constructor(private readonly secret: string, private readonly expiresIn: string = "1h") {}

  async sign(payload: Record<string, any>): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"] });
  }

  async verify(token: string): Promise<Record<string, any>> {
    return jwt.verify(token, this.secret) as Record<string, any>;
  }
}

