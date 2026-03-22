import { UserCredential } from "./UserCredential";
import { UserCredentialReferenceCode } from "./UserCredentialReferenceCode";

export abstract class IUserCredentialRepository {
  abstract saveNew(credential: UserCredential): Promise<UserCredential>;
  abstract persistUpdates(credential: UserCredential): Promise<UserCredential>;
  abstract findByEmail(email: string): Promise<UserCredential | null>;
  abstract deleteByEmail(email: string): Promise<boolean>;
}

export abstract class IUserCredentialReferenceRepository {
  abstract saveNew(reference: UserCredentialReferenceCode): Promise<UserCredentialReferenceCode>;
  abstract findByReferenceCode(code: string): Promise<UserCredentialReferenceCode | null>;
  abstract deleteByReferenceCode(code: string): Promise<boolean>;
}

export abstract class IEncryptionService {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}

export abstract class IJWTService {
  abstract sign(payload: Record<string, any>): Promise<string>;
  abstract verify(token: string): Promise<Record<string, any>>;
}

export abstract class IOTPService {
  abstract createAndSendOtpToEmail(email: string): Promise<string>;
  abstract verifyOtp(reference: string, otp: string): Promise<boolean>;
}
