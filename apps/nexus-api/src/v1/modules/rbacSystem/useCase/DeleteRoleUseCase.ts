import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class DeleteRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(roleName: string) {
    await this.roleRepository.deleteByName(roleName);

    return true;
  }
}
