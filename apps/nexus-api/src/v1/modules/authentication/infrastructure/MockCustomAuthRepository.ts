import { ICustomAuthRepository } from "../domain/Interfaces";
import { User } from "../domain/User";

export class MockCustomAuthRepository implements ICustomAuthRepository {
  private users: User[] = [];

  async saveNew(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async persistUpdates(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  async deleteByUsername(username: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.username !== username);
    return this.users.length < initialLength;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((u) => u.username === username) || null;
  }
}
