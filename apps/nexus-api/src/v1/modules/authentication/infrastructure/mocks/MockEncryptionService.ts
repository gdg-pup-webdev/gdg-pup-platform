import { IEncryptionService } from "../../domain/IAuthenticationInterfaces.js";

export class MockEncryptionService implements IEncryptionService {
  async hash(value: string): Promise<string> {
    return Promise.resolve(`hashed-${value}`);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    // Basic comparison logic: if the hash matches what we expect from hashing value
    return Promise.resolve(`hashed-${value}` === hash);
  }
}

