import { IUserCredentialReferenceRepository } from "../../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode } from "../../domain/UserCredentialReferenceCode.js";

export class MockUserCredentialReferenceRepository implements IUserCredentialReferenceRepository {
  private references: UserCredentialReferenceCode[] = [];

  constructor() {
    this.references = [];
  }

  async saveNew(reference: UserCredentialReferenceCode): Promise<UserCredentialReferenceCode> {
    this.references.push(reference);
    return reference;
  }

  async persistUpdates(reference: UserCredentialReferenceCode): Promise<UserCredentialReferenceCode> {
    const index = this.references.findIndex((r) => r.props.referenceCode === reference.props.referenceCode);
    if (index !== -1) {
      this.references[index] = reference;
    }
    return reference;
  }

  async findByReferenceCode(code: string): Promise<UserCredentialReferenceCode | null> {
    const reference = this.references.find((r) => r.props.referenceCode === code);
    return reference || null;
  }

  async deleteByReferenceCode(code: string): Promise<boolean> {
    const initialLength = this.references.length;
    this.references = this.references.filter((r) => r.props.referenceCode !== code);
    return this.references.length < initialLength;
  }
}

