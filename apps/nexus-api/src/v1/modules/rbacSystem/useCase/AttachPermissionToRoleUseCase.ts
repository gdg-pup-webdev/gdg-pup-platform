import { IRoleRepository } from "../domain/IRoleRepository";

export class AttachPermissionToRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(roleName: string, resource: string, action: string) {
    const role = await this.roleRepository.findByName(roleName);
    await role.attachPermission(resource, action);
    await this.roleRepository.persistUpdates(role);
    return role;
  }
}
