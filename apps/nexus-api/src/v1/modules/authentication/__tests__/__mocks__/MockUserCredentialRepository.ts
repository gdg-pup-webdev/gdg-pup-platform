import { IUserCredentialRepository } from "../../domain/IAuthenticationInterfaces";
import { UserCredential } from "../../domain/UserCredential";

export class MockUserCredentialRepository implements IUserCredentialRepository {
  private credentials: UserCredential[] = [];

  async saveNew(credential: UserCredential): Promise<UserCredential> {
    this.credentials.push(credential);
    return credential;
  }

  async persistUpdates(credential: UserCredential): Promise<UserCredential> {
    const index = this.credentials.findIndex((c) => c.props.id === credential.props.id);
    this.credentials[index] = credential;
    return credential;
  }

  async findByEmail(email: string): Promise<UserCredential | null> {
    const credential = this.credentials.find((c) => c.props.emailAddress === email);
    return credential || null;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const index = this.credentials.findIndex((c) => c.props.emailAddress === email);
    if (index > -1) {
      this.credentials.splice(index, 1);
      return true;
    }
    return false;
  }
}
