import { IUserCredentialRepository } from "../domain/IAuthenticationInterfaces.js";
import { UserCredential } from "../domain/UserCredential.js";

export class MockUserCredentialRepository implements IUserCredentialRepository {
  private credentials: UserCredential[] = [];

  constructor() {
    this.credentials = [];
  }

  async saveNew(credential: UserCredential): Promise<UserCredential> {
    this.credentials.push(credential);
    return credential;
  }

  async persistUpdates(credential: UserCredential): Promise<UserCredential> {
    const index = this.credentials.findIndex((c) => c.props.id === credential.props.id);
    if (index !== -1) {
      this.credentials[index] = credential;
    } else {
      this.credentials.push(credential);
    }
    return credential;
  }

  async findByEmail(email: string): Promise<UserCredential | null> {
    const credential = this.credentials.find((c) => c.props.emailAddress === email);
    return credential || null;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const initialLength = this.credentials.length;
    this.credentials = this.credentials.filter((c) => c.props.emailAddress !== email);
    return this.credentials.length < initialLength;
  }
}

