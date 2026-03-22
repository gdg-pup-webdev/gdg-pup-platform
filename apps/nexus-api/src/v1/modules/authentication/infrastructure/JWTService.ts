import * as jose from "jose";
import { IJWTService } from "../domain/Interfaces";

export class JWTService implements IJWTService {
  private readonly secret: Uint8Array;

  constructor() {
    const secretStr = process.env.JWT_SECRET || "development-secret-key-change-this-must-be-long-enough";
    this.secret = new TextEncoder().encode(secretStr);
  }

  async sign(payload: Record<string, any>): Promise<string> {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(this.secret);
  }

  async verify(token: string): Promise<Record<string, any>> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret);
      return payload as Record<string, any>;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
