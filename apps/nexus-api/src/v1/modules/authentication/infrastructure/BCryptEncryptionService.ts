import bcrypt from "bcryptjs";
import { IEncryptionService } from "../domain/Interfaces";

export class BCryptEncryptionService implements IEncryptionService {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
