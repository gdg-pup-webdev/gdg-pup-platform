import { IEncryptionService, IJWTService } from "../domain/Interfaces";

export class MockEncryptionService implements IEncryptionService {
  async hash(value: string): Promise<string> {
    return `hashed_${value}`;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    return `hashed_${value}` === hash;
  }
}

export class MockJWTService implements IJWTService {
  async sign(payload: Record<string, any>): Promise<string> {
    return `token_${Buffer.from(JSON.stringify(payload)).toString("base64")}`;
  }
  async verify(token: string): Promise<Record<string, any>> {
    const raw = token.replace("token_", "");
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  }
}
