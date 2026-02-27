import { User } from "./domain/User";
import { GetUserUseCase } from "./useCases/GetUserUseCase";
import { ListUsersUseCase } from "./useCases/ListUsersUseCase";

interface UserResponseDTO {
  id: string;
  email: string;
  username: string;
  roleId: string;
  createdAt: string;
}

export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
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
      roleId: props.roleId,
      createdAt: props.createdAt.toISOString(),
    };
  }

  /**
   * Endpoint handler for getting a single user.
   * In a framework like Express, the 'id' would come from req.params.id
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
      // Handle the error (e.g., return a 404/400 status equivalent)
      return {
        error: error.message || "An unexpected error occurred.",
      };
    }
  }

  /**
   * Endpoint handler for listing users with pagination.
   * In a web framework, pageNumber and pageSize would come from req.query
   */
  async listUsers(pageNumber: number, pageSize: number) {
    try {
      // Note: Using the signature from your implementation
      const result = await this.listUsersUseCase.execute(pageNumber, pageSize);

      // Map the array of domain entities to an array of DTOs
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
}
