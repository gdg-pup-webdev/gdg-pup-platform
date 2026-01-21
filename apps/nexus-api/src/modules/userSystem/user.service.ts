import { tryCatch } from "@/utils/tryCatch.util.js";
import { UserRepository, userRepositoryInstance } from "./user.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";
 
export class UserService {
  constructor(
    private userRepository: UserRepository = userRepositoryInstance
  ) {}

  getUserById = async (userId: string)   => {
    const { data, error } = await tryCatch(
      async () => await this.userRepository.getUserById(userId), "getting user"
    );

    if (error) throw new RepositoryError(error.message);
    
    return data
  };


  listUsers = async () => {
    const { data, error } = await tryCatch(
      async () => await this.userRepository.listUsers(), "listing users"
    );

    if (error) throw new RepositoryError(error.message);
    
    return data
  }
}

export const userServiceInstance = new UserService();