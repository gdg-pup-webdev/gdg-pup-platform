import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";

export interface GetUserRequest {
  id: string;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: GetUserRequest): Promise<User> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      // In a real application, you might want to throw a custom ApplicationError
      throw new Error(`User with ID ${request.id} not found.`);
    }

    return user;
  }
}
