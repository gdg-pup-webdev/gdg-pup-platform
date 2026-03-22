import { IEncryptionService } from "../domain/IAuthenticationInterfaces.js";
import * as bcrypt from "bcrypt";

export class BcryptEncryptionService implements IEncryptionService {
  constructor(private readonly saltRounds: number = 10) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}

