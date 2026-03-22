import { User } from "../domain/User";
import { ICustomAuthRepository } from "../domain/IAuthenticationInterfaces";

export class MockUserCredentialRepository implements ICustomAuthRepository {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.props.emailAddress === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.props.username === username) || null;
  }

  async saveNew(user: User): Promise<User> {
    this.users.set(user.props.id, user);
    return user;
  }

  async persistUpdates(user: User): Promise<User> {
    this.users.set(user.props.id, user);
    return user;
  }

  async deleteByUsername(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    if (user) {
      this.users.delete(user.props.id);
      return true;
    }
    return false;
  }

  generateOtp(): string {
    return "123456";
  }
}
