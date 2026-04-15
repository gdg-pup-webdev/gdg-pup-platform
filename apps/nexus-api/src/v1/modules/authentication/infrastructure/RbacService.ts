import { gdgMembersController } from "../../members/index.js";
import { RbacModuleController } from "../../rbacSystem/RbacModuleController.js";
import { IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { Permission } from "../domain/TokenPayload.js";

export class RbacService implements IRbacService {
  constructor(private readonly rbacController: RbacModuleController) {}

  async listPermissionsOfUser(email: string): Promise<Permission[]> {
    const user = await gdgMembersController.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const rolesandpermissions =
      await this.rbacController.getRolesAndPermissionsOfUser(user.gdgId);

    const permissions = rolesandpermissions.flatMap((role) =>
      role.permissions.map((perm) => {
        return {
          resource: perm.resource,
          action: perm.action,
          from_role: role.name,
        };
      }),
    );
    return permissions;
  }

  async listRolesOfUser(email: string): Promise<string[]> {
    // const roles = await this.rbacController.getRolesAndPermissionsOfUser(email);
    // return roles.map((role) => role.name);

    const user = await gdgMembersController.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const rolesandpermissions =
      await this.rbacController.getRolesAndPermissionsOfUser(user.gdgId);

    const roles = rolesandpermissions.map((role) => role.name);

    return roles;
  }

  async listPermissionsAndRolesByGdgId(
    gdgId: string,
  ): Promise<{ permissions: Permission[]; roles: string[] }> {
    const rolesandpermissions =
      await this.rbacController.getRolesAndPermissionsOfUser(gdgId);
    const permissions = rolesandpermissions.flatMap((role) =>
      role.permissions.map((perm) => {
        return {
          resource: perm.resource,
          action: perm.action,
          from_role: role.name,
        };
      }),
    );
    const roles = rolesandpermissions.map((role) => role.name);

    return { permissions, roles };
  }
}
