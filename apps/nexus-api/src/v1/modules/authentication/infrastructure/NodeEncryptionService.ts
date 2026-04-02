import { IEncryptionService } from "../domain/IAuthenticationInterfaces.js";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export class NodeEncryptionService implements IEncryptionService {
  async hash(value: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(value, salt, 64)) as Buffer;
    return `${salt}:${buf.toString("hex")}`;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(value, salt, 64)) as Buffer;
    return timingSafeEqual(keyBuffer, derivedKey);
  }
}

