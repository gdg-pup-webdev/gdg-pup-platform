// ============================================================================
// 1. IMPORTS
// ============================================================================
 
import { RoleRepository } from "./infratructure/RoleRepository";
import { UserRepository } from "./infratructure/UserRepository";
import { RbacModuleController } from "./RbacModuleController"; 
import { AssignRoleToUserUseCase } from "./useCase/AssignRoleToUserUseCase";
import { AttachPermissionToRoleUseCase } from "./useCase/AttachPermissionToRoleUseCase";
import { CreateRoleUseCase } from "./useCase/CreateRoleUseCase";
import { DeleteRoleUseCase } from "./useCase/DeleteRoleUseCase";
import { GetRoleUseCase } from "./useCase/GetRoleUseCase";
import { ListRoleUseCase } from "./useCase/ListRolesUseCase";
import { RemovePermissionFromRoleUseCase } from "./useCase/RemovePermissionFromRoleUseCase";
import { RemoveRoleFromUserUserCase } from "./useCase/RemoveRoleFromUserUserCase";
import { UpdateRoleUseCase } from "./useCase/UpdateRoleUseCase";

 

// ============================================================================
// 2. DEPENDENCY INJECTION & INITIALIZATION
// ============================================================================

// A. Initialize Adapters (Infrastructure Layer)
// These new classes should implement your clean IRoleRepository and IUserRepository interfaces,
// replacing the old direct-Supabase singletons you discarded.
const roleRepositoryAdapter = new RoleRepository();
const userRepositoryAdapter = new UserRepository();

// B. Initialize Use Cases (Application Layer)
// We inject the infrastructure adapters into the business logic layer
const assignRoleToUserUseCase = new AssignRoleToUserUseCase(
  roleRepositoryAdapter,
  userRepositoryAdapter,
);
const attachPermissionToRoleUseCase = new AttachPermissionToRoleUseCase(
  roleRepositoryAdapter,
);
const createRoleUseCase = new CreateRoleUseCase(roleRepositoryAdapter);
const deleteRoleUseCase = new DeleteRoleUseCase(roleRepositoryAdapter);
const getRoleUseCase = new GetRoleUseCase(roleRepositoryAdapter);
const listRoleUseCase = new ListRoleUseCase(roleRepositoryAdapter);
const removePermissionFromRoleUseCase = new RemovePermissionFromRoleUseCase(
  roleRepositoryAdapter,
);
const removeRoleFromUserUseCase = new RemoveRoleFromUserUserCase(
  userRepositoryAdapter,
);
const updateRoleUseCase = new UpdateRoleUseCase(roleRepositoryAdapter);

// C. Initialize Controller (Presentation/Interface Layer)
// We inject all the configured use cases into the primary controller
export const rbacController = new RbacModuleController(
  assignRoleToUserUseCase,
  attachPermissionToRoleUseCase,
  createRoleUseCase,
  deleteRoleUseCase,
  getRoleUseCase,
  listRoleUseCase,
  removePermissionFromRoleUseCase,
  removeRoleFromUserUseCase,
  updateRoleUseCase,
);