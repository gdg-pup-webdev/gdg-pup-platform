import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import {
  RepositoryConflictError,
  RepositoryError,
  ServerError,
} from "@/classes/ServerError.js";
import { TablesInsert } from "@/types/supabase.types.js";

export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance,
  ) {}

  /**
   * Get all roles of a user
   */
  getRolesOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRolesOfUser(userId),
      "getting roles of user",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Create a new role
   */
  createRole = async (roleData: TablesInsert<"user_role">) => {
    // Create role
    const { data, error } = await tryCatch(
      async () => await this.repository.createRole(roleData),
      "creating role",
    );

    if (error) {
      throw error;
    }

    return data;
  };
}

export const roleServiceInstance = new RoleService();
