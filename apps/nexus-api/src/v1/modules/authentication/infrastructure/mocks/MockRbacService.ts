import { IRbacService } from "../../domain/IAuthenticationInterfaces.js";
import { Permission } from "../../domain/TokenPayload.js";

export class MockRbacService implements IRbacService {
  public permissions: Permission[] = [{
    resource: "event",
    action: "create",
    from_role: "admin",
  }, {
    resource: "event",
    action: "read",
    from_role: "admin",
  }];

  async listPermissionsOfUser(email: string): Promise<Permission[]> {
    return this.permissions;
  }

  async listRolesOfUser(email: string): Promise<string[]> {
    return ["oen", "two"];
  }
}
