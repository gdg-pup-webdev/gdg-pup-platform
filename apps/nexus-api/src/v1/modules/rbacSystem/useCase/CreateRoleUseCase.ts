import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class CreateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(name: string, description: string) {
    const role = Role.create({
      name,
      description,
    });

    await this.roleRepository.saveNew(role);

    return role;
  }
}
