import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";

export interface ListUsersRequest {
  pageNumber: number;
  pageSize: number;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(pageNumber: number, pageSize: number) {
    // If you add pagination to the request, you would pass it to findAll() here
    const users = await this.userRepository.paginatedList(pageNumber, pageSize);

    return users;
  }
}
