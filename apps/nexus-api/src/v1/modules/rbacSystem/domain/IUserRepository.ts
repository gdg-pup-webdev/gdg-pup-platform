import { User } from "./User";

export abstract class IUserRepository {
  abstract findById(userId: string): Promise<User>;
  abstract persistUpdates(user: User): Promise<boolean>;
}
