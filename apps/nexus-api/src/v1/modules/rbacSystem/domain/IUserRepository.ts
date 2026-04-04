import { User } from "./User";

 
export abstract class IUserRepository { 
  abstract findById(gdgId: string)        : Promise<User>;
  abstract persistUpdates(user: User)      : Promise<void>;
}
