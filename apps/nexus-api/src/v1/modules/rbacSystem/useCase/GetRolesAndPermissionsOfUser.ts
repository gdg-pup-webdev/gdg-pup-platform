import { IUserRepository } from "../domain/IUserRepository";

export class GetRolesAndPermissionsOfUser {
  constructor(private readonly userReponsitory: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userReponsitory.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    return user.props.rolesWithPermissions;
  }
}
