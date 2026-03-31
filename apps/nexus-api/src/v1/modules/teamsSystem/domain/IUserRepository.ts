// By defining this here, the Team module dictates what it needs from the User module, 
 
import { User } from "./User";

// strictly adhering to the Dependency Inversion Principle.
export interface IUserRepository {
  findById(userId: string): Promise<User | null>; // Returns the User entity or null
}