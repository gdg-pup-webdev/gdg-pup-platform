import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class GetRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(roleName: string) {
    const role = await this.roleRepository.findByName(roleName);

    return role;
  }
}
