import { User } from "./domain/User";
import { GetUserUseCase } from "./useCases/GetUserUseCase";
import { ListUsersUseCase } from "./useCases/ListUsersUseCase";
import { SearchUsersUseCase } from "./useCases/SearchUsersUseCase";

export interface UserResponseDTO {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  avatarUrl: string | null;
  gdgId: string | null;
  roleId: string;
  createdAt: string;
}

/**
 * @deprecated
 */
export class UserModuleController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
  ) {}

  /**
   * Private mapper function to transform the Domain Entity into a simple DTO.
   */
  private toDTO(user: User): UserResponseDTO {
    const props = user.props;
    return {
      id: props.id,
      email: props.email,
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      displayName: props.displayName,
      avatarUrl: props.avatarUrl,
      gdgId: props.gdgId,
      roleId: props.roleId,
      createdAt: props.createdAt.toISOString(),
    };
  }

  /**
   * Endpoint handler for getting a single user.
   */
  async getUser(
    id: string,
  ): Promise<{ data?: UserResponseDTO; error?: string }> {
    try {
      const user = await this.getUserUseCase.execute({ id });

      return {
        data: this.toDTO(user),
      };
    } catch (error: any) {
      return {
        error: error.message || "An unexpected error occurred.",
      };
    }
  }

  /**
   * Endpoint handler for listing users with pagination.
   */
  async listUsers(pageNumber: number, pageSize: number) {
    try {
      const result = await this.listUsersUseCase.execute(pageNumber, pageSize);
      const usersDTO = result.list.map((user) => this.toDTO(user));

      return {
        list: usersDTO,
        count: result.count,
      };
    } catch (error: any) {
      return {
        error:
          error.message || "An unexpected error occurred while fetching users.",
      };
    }
  }

  /**
   * Endpoint handler for searching users.
   */
  async searchUsers(query: string, limit: number = 10) {
    try {
      const users = await this.searchUsersUseCase.execute(query, limit);
      return {
        list: users.map((user) => this.toDTO(user)),
      };
    } catch (error: any) {
      return {
        error: error.message || "An unexpected error occurred while searching users.",
      };
    }
  }
}
