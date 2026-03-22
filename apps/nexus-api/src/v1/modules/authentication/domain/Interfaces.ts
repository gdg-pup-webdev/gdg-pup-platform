import { User } from "./User";

export abstract class ICustomAuthRepository {
  abstract saveNew(user: User): Promise<User>;
  abstract persistUpdates(user: User): Promise<User>;
  abstract deleteByUsername(username: string): Promise<boolean>;
  abstract findByUsername(username: string): Promise<User | null>;
}

export abstract class IEncryptionService {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}

export abstract class IJWTService {
  abstract sign(payload: Record<string, any>): Promise<string>;
  abstract verify(token: string): Promise<Record<string, any>>;
}
