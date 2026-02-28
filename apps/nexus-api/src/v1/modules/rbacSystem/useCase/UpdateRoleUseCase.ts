import { IRoleRepository } from "../domain/IRoleRepository";
import { Role, RoleUpdateProps } from "../domain/Role";

export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(name: string, dto: RoleUpdateProps) {
    const role = await this.roleRepository.findByName(name);
    role.update(dto);
    await this.roleRepository.persistUpdates(role);

    return role;
  }
}
