import { SupabaseUserRepository } from "./infrastructure/UserRepositoy";
import { GetUserUseCase } from "./useCases/GetUserUseCase";
import { ListUsersUseCase } from "./useCases/ListUsersUseCase";
import { SearchUsersUseCase } from "./useCases/SearchUsersUseCase";
import { UserModuleController } from "./UserModuleController";

// 2. Instantiate the Infrastructure Layer (Data Access)
const userRepository = new SupabaseUserRepository();

// 3. Instantiate the Application Layer (Use Cases), injecting the repository
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const searchUsersUseCase = new SearchUsersUseCase(userRepository);

// 4. Instantiate the Presentation Layer (Controller), injecting the use cases
/**
 * @deprecated
 */
export const userModuleController = new UserModuleController(
  getUserUseCase,
  listUsersUseCase,
  searchUsersUseCase,
);
/**
 * @deprecated
 */
export * from "./UserModuleController";
