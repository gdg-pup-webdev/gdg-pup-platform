import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class ListRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(pageNumber: number, pageSize: number) {
    const result = await this.roleRepository.listRoles(pageNumber, pageSize);

    return result;
  }
}
