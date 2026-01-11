import { UserRepository, userRepositoryInstance } from "./user.repository.js";

export class UserService {
  constructor(
    private userRepository: UserRepository = userRepositoryInstance
  ) {}

  getUserById = async (userId: string) => {
    const { data, error } = await this.userRepository.getUserById(userId);
    if (error) {
        return {error}
    }
    return {data};
  };
}

export const userServiceInstance = new UserService();