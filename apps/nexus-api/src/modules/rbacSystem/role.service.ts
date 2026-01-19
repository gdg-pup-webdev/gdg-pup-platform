import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";

export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance
  ) {}

  getRolesOfUser = async (userId: string) => {
    const { data, error } = await this.roleRepository.getRolesOfUser(userId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const roleServiceInstance = new RoleService();
