import { IUserCredentialReferenceRepository } from "../../domain/IAuthenticationInterfaces";
import { UserCredentialReferenceCode } from "../../domain/UserCredentialReferenceCode";

export class MockUserCredentialReferenceRepository implements IUserCredentialReferenceRepository {
  private references: UserCredentialReferenceCode[] = [];

  async saveNew(reference: UserCredentialReferenceCode): Promise<UserCredentialReferenceCode> {
    this.references.push(reference);
    return reference;
  }

  async findByReferenceCode(code: string): Promise<UserCredentialReferenceCode | null> {
    const reference = this.references.find((r) => r.props.referenceCode === code);
    return reference || null;
  }

  async deleteByReferenceCode(code: string): Promise<boolean> {
    const index = this.references.findIndex((r) => r.props.referenceCode === code);
    if (index > -1) {
      this.references.splice(index, 1);
      return true;
    }
    return false;
  }
}
