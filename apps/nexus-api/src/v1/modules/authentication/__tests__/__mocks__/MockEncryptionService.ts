import { IEncryptionService } from "../../domain/IAuthenticationInterfaces";

export class MockEncryptionService implements IEncryptionService {
  async hash(value: string): Promise<string> {
    return Promise.resolve(`hashed-${value}`);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(`hashed-${value}` === hash);
  }
}
