import { RoleUpdateProps } from "./domain/Role";
import { AssignRoleToUserUseCase } from "./useCase/AssignRoleToUserUseCase";
import { AttachPermissionToRoleUseCase } from "./useCase/AttachPermissionToRoleUseCase";
import { CreateRoleUseCase } from "./useCase/CreateRoleUseCase";
import { DeleteRoleUseCase } from "./useCase/DeleteRoleUseCase";
import { GetRoleUseCase } from "./useCase/GetRoleUseCase";
import { ListRoleUseCase } from "./useCase/ListRolesUseCase";
import { RemovePermissionFromRoleUseCase } from "./useCase/RemovePermissionFromRoleUseCase";
import { RemoveRoleFromUserUserCase } from "./useCase/RemoveRoleFromUserUserCase"; 
import { UpdateRoleUseCase } from "./useCase/UpdateRoleUseCase";

export class RbacModuleController {
  constructor(
    private assignRoleToUserUseCase: AssignRoleToUserUseCase,
    private attachPermissionToRoleUseCase: AttachPermissionToRoleUseCase,
    private createRoleUseCase: CreateRoleUseCase,
    private deleteRoleUseCase: DeleteRoleUseCase,
    private getRoleUseCase: GetRoleUseCase,
    private listRoleUseCase: ListRoleUseCase,
    private removePermissionFromRoleUseCase: RemovePermissionFromRoleUseCase,
    private removeRoleFromUserUseCase: RemoveRoleFromUserUserCase,
    private updateRoleUseCase: UpdateRoleUseCase,
  ) {}

  async assignRoleToUser(userId: string, roleName: string) {
    const result = await this.assignRoleToUserUseCase.execute(userId, roleName);

    return {
      id: result.props.id,
      roles: [...result.props.roles], // Spreading the string array to ensure a flat, safe copy
    };
  }

  async attachPermissionToRole(
    roleName: string,
    resource: string,
    action: string,
  ) {
    const result = await this.attachPermissionToRoleUseCase.execute(
      roleName,
      resource,
      action,
    );

    return {
      id: result.props.id,
      name: result.props.name,
      description: result.props.description,
      permissions: [...result.props.permissions],
    };
  }

  async createRole(name: string, description: string) {
    const result = await this.createRoleUseCase.execute(name, description);

    return {
      id: result.props.id,
      name: result.props.name,
      description: result.props.description,
      permissions: [...result.props.permissions],
    };
  }

  async deleteRole(roleName: string) {
    const result = await this.deleteRoleUseCase.execute(roleName);
    return result; // Returns boolean true
  }

  async getRole(roleName: string) {
    const result = await this.getRoleUseCase.execute(roleName);

    return {
      id: result.props.id,
      name: result.props.name,
      description: result.props.description,
      permissions: [...result.props.permissions],
    };
  }

  async listRoles(pageNumber: number, pageSize: number) {
    const result = await this.listRoleUseCase.execute(pageNumber, pageSize);

    return {
      list: result.list.map((role) => ({
        id: role.props.id,
        name: role.props.name,
        description: role.props.description,
        permissions: [...role.props.permissions],
      })),
      count: result.count,
    };
  }

  async removePermissionFromRole(
    roleName: string,
    resource: string,
    action: string,
  ) {
    const result = await this.removePermissionFromRoleUseCase.execute(
      roleName,
      resource,
      action,
    );

    return {
      id: result.props.id,
      name: result.props.name,
      description: result.props.description,
      permissions: [...result.props.permissions],
    };
  }

  async removeRoleFromUser(userId: string, roleName: string) {
    const result = await this.removeRoleFromUserUseCase.execute(
      userId,
      roleName,
    );

    return {
      id: result.props.id,
      roles: [...result.props.roles], // Spreading the string array to ensure a flat, safe copy
    };
  }

  async updateRole(name: string, dto: RoleUpdateProps) {
    const result = await this.updateRoleUseCase.execute(name, dto);

    return {
      id: result.props.id,
      name: result.props.name,
      description: result.props.description,
      permissions: [...result.props.permissions],
    };
  }
}