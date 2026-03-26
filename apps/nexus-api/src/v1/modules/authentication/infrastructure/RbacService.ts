import { RbacModuleController } from "../../rbacSystem/RbacModuleController.js";
import { IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { Permission } from "../domain/TokenPayload.js";

export class RbacService implements IRbacService {
  constructor(private readonly rbacController: RbacModuleController) {}

  async listPermissionsOfUser(email: string): Promise<Permission[]> { 
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

  async listRolesOfUser(email: string): Promise<string[]> {
    // const roles = await this.rbacController.getRolesAndPermissionsOfUser(email);
    // return roles.map((role) => role.name);
    return ["admin"];
  }
}
