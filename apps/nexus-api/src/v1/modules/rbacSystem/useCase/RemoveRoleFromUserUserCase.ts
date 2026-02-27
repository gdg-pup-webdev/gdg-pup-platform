import { IRoleRepository } from "../domain/IRoleRepository";
import { IUserRepository } from "../domain/IUserRepository";

export class RemoveRoleFromUserUserCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, roleName: string) {
    const user = await this.userRepository.findById(userId);
    await user.detachRole(roleName);
    await this.userRepository.persistUpdates(user);

    return user;
  }
}
