import { RbacModuleController } from "../../rbacSystem/RbacModuleController.js";
import { IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { Permission } from "../domain/TokenPayload.js";

export class RbacService implements IRbacService {
  constructor(private readonly rbacController: RbacModuleController) {}

  async listPermissionsOfUser(email: string): Promise<Permission[]> {
    // const roles = await this.rbacController.getRolesAndPermissionsOfUser(email);
    // const permissions: Permission[] = [];

    // roles.forEach((role) => {
    //   role.permissions.forEach((permission) => {
    //     permissions.push({
    //       resource: permission.resource,
    //       action: permission.action,
    //       from_role: role.name,
    //     });
    //   });
    // });

    const permissions = [
      {
        resource: "event",
        action: "create",
        from_role: "admin",
      },
      {
        resource: "event",
        action: "read",
        from_role: "admin",
      },
    ];

    return permissions;
  }
}
