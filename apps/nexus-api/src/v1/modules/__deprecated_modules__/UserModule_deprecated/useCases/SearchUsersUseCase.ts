import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";

export class SearchUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: string, limit: number = 10): Promise<User[]> {
    if (!query) return [];
    return await this.userRepository.search(query, limit);
  }
}
