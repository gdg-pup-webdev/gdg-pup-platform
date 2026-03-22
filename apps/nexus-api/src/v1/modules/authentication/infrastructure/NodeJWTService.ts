import { IJWTService } from "../domain/IAuthenticationInterfaces";

export class NodeJWTService implements IJWTService {
  private readonly secret = process.env.JWT_SECRET || "default-secret";

  async sign(payload: Record<string, any>): Promise<string> {
    const data = JSON.stringify(payload);
    const signature = Buffer.from(this.secret + data).toString("base64");
    return Buffer.from(data).toString("base64") + "." + signature;
  }

  async verify(token: string): Promise<Record<string, any>> {
    const [dataB64, signature] = token.split(".");
    const data = Buffer.from(dataB64, "base64").toString();
    const expectedSignature = Buffer.from(this.secret + data).toString("base64");
    if (signature !== expectedSignature) throw new Error("Invalid signature");
    return JSON.parse(data);
  }
}
