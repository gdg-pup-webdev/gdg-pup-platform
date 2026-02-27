import { IRoleRepository } from "../domain/IRoleRepository";
import { IUserRepository } from "../domain/IUserRepository";

export class AssignRoleToUserUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, roleName: string) {
    const user = await this.userRepository.findById(userId);
    const role = await this.roleRepository.findByName(roleName);
    user.attachRole(role);
    await this.userRepository.persistUpdates(user);

    return user;
  }
}
