import { MemberInfo, Permission, TokenPayload } from "./TokenPayload.js";
import { UserCredential } from "./UserCredential.js";
import { UserCredentialReferenceCode } from "./UserCredentialReferenceCode.js";

export abstract class IUserCredentialRepository {
  abstract saveNew(credential: UserCredential): Promise<UserCredential>;
  abstract persistUpdates(credential: UserCredential): Promise<UserCredential>;
  abstract findByEmail(email: string): Promise<UserCredential | null>;
  abstract deleteByEmail(email: string): Promise<boolean>;
}

export abstract class IUserCredentialReferenceRepository {
  abstract saveNew(
    reference: UserCredentialReferenceCode,
  ): Promise<UserCredentialReferenceCode>;
  abstract persistUpdates(
    reference: UserCredentialReferenceCode,
  ): Promise<UserCredentialReferenceCode>;
  abstract findByReferenceCode(
    code: string,
  ): Promise<UserCredentialReferenceCode | null>;
  abstract deleteByReferenceCode(code: string): Promise<boolean>;
}

export abstract class IEncryptionService {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}

export abstract class IJWTService {
  abstract sign(payload: TokenPayload): Promise<string>;
  abstract verify(token: string): Promise<TokenPayload>;
}

export abstract class IOTPService {
  abstract createAndSendOtpToEmail(email: string, context?: string): Promise<string>;
  abstract verifyOtp(reference: string, otp: string): Promise<boolean>;
}

export abstract class IRbacService {
  abstract listPermissionsOfUser(email: string): Promise<Permission[]>;
  abstract listRolesOfUser(email: string): Promise<string[]>;
}

export abstract class IGdgMemberService {
  abstract getMemberInfoByEmail(email: string): Promise<MemberInfo>;
}
