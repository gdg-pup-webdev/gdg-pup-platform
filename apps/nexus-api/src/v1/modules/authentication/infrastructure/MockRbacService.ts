import { IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { Permission } from "../domain/TokenPayload.js";

export class MockRbacService implements IRbacService {
  public permissions: Permission[] = [];

  async listPermissionsOfUser(email: string): Promise<Permission[]> {
    return this.permissions;
  }
}
