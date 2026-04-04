import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class GetRoleById {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(roleId: string) {
    const role = await this.roleRepository.findById(roleId);

    return role;
  }
}
