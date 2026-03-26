import { RbacModuleController } from "../../rbacSystem/RbacModuleController.js";
import { IRbacService } from "../domain/IAuthenticationInterfaces.js";
import { Permission } from "../domain/TokenPayload.js";
  

import { GdgMembersController } from "../../gdgMembers/GdgMembersController.js";
import { IGdgMemberService } from "../domain/IAuthenticationInterfaces.js";
import { MemberInfo } from "../domain/TokenPayload.js";

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



export class GdgMemberService implements IGdgMemberService {
  constructor(private readonly gdgMembersController: GdgMembersController) {}

  async getMemberInfoByEmail(email: string): Promise<MemberInfo> {
    const member = await this.gdgMembersController.findByEmail(email);
    if (!member) {
      throw new Error("Member not found");
    }

    return {
      gdgId: member.gdgId,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      suffix: member.suffix,
    };
  }
}



export class MockGdgMemberService implements IGdgMemberService {
  // We remove the constructor dependency on the real controller entirely.

  async getMemberInfoByEmail(email: string): Promise<MemberInfo> {
    // Simulate a "not found" scenario for a specific test email
    if (email === "notfound@example.com") {
      throw new Error("Member not found");
    }

    // Return a predictable mock member for all other emails
    return {
      gdgId: "mock-gdg-12345",
      firstName: "Jane",
      middleName: "A",
      lastName: "Doe",
      suffix: "",
    };
  }
}