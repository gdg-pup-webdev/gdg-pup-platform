import { Role } from "./Role";



export abstract class IRoleRepository {

  abstract saveNew(role: Role): Promise<Role>;

  abstract persistUpdates(role: Role): Promise<Role>;

  abstract findByName(name: string): Promise<Role>;

  abstract deleteByName(name: string): Promise<void>;

  abstract listRoles(

    pageNumber: number,

    pageSize: number,

  ): Promise<{ list: Role[]; count: number }>;

}import { User } from "./User";



export abstract class IUserRepository {

  abstract findById(userId: string): Promise<User>;

  abstract persistUpdates(user: User): Promise<boolean>;

}

export type RoleProps = {

  id: string;

  name: string;

  description: string;

  permissions: {

    resource: string;

    action: string;

  }[];

};



export type RoleInsertProps = Omit<RoleProps, "id" | "permissions">;



export type RoleUpdateProps = Partial<RoleInsertProps>;



export class Role {

  _props: RoleProps;

  constructor(props: RoleProps) {

    this._props = props;

  }



  static create = (props: RoleInsertProps) => {

    return new Role({

      ...props,

      permissions: [],

      id: crypto.randomUUID(),

    });

  };



  static hydrate = (props: RoleProps) => {

    return new Role(props);

  };



  get props() {

    return this._props;

  }



  update = (props: RoleUpdateProps) => {

    this._props = { ...this._props, ...props };

  };



  attachPermission = (resource: string, action: string) => {

    this._props.permissions.push({

      resource,

      action,

    });

  };



  detachPermission = (resource: string, action: string) => {

    this._props.permissions = this._props.permissions.filter((permission) => {

      return !(

        permission.resource === resource && permission.action === action

      );

    });

  };

}

import { Role } from "./Role";



export type UserProps = {

  id: string;

  roles: string[];

};



export class User {

  _props: UserProps;

  constructor(props: UserProps) {

    this._props = props;

  }



  static hydrate = (props: UserProps) => {

    return new User(props);

  };



  get props() {

    return this._props;

  }



  attachRole = (role: Role) => {

    this._props.roles.push(role.props.name);

  };



  detachRole = (roleName: string) => {

    this._props.roles = this._props.roles.filter((role) => {

      return role !== roleName;

    });

  };

}

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

import { IRoleRepository } from "../domain/IRoleRepository";



export class AttachPermissionToRoleUseCase {

  constructor(private readonly roleRepository: IRoleRepository) {}



  async execute(roleName: string, resource: string, action: string) {

    const role = await this.roleRepository.findByName(roleName);

    await role.attachPermission(resource, action);

    await this.roleRepository.persistUpdates(role);

    return role;

  }

}

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role } from "../domain/Role";



export class CreateRoleUseCase {

  constructor(private readonly roleRepository: IRoleRepository) {}



  async execute(name: string, description: string) {

    const role = Role.create({

      name,

      description,

    });



    await this.roleRepository.saveNew(role);



    return role;

  }

}

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role } from "../domain/Role";



export class DeleteRoleUseCase {

  constructor(private readonly roleRepository: IRoleRepository) {}



  async execute(roleName: string) {

    await this.roleRepository.deleteByName(roleName);



    return true;

  }

}

// ============================================================================

// 1. IMPORTS

// ============================================================================

 

import { RoleRepository } from "./infratructure/RoleRepository";

import { UserRepository } from "./infratructure/UserRepository";

import { RbacModuleController } from "./RbacModuleController"; 

import { AssignRoleToUserUseCase } from "./useCase/AssignRoleToUserUseCase";

import { AttachPermissionToRoleUseCase } from "./useCase/AttachPermissionToRoleUseCase";

import { CreateRoleUseCase } from "./useCase/CreateRoleUseCase";

import { DeleteRoleUseCase } from "./useCase/DeleteRoleUseCase";

import { GetRoleUseCase } from "./useCase/GetRoleUseCase";

import { ListRoleUseCase } from "./useCase/ListRolesUseCase";

import { RemovePermissionFromRoleUseCase } from "./useCase/RemovePermissionFromRoleUseCase";

import { RemoveRoleFromUserUserCase } from "./useCase/RemoveRoleFromUserUserCase";

import { UpdateRoleUseCase } from "./useCase/UpdateRoleUseCase";



 



// ============================================================================

// 2. DEPENDENCY INJECTION & INITIALIZATION

// ============================================================================



// A. Initialize Adapters (Infrastructure Layer)

// These new classes should implement your clean IRoleRepository and IUserRepository interfaces,

// replacing the old direct-Supabase singletons you discarded.

const roleRepositoryAdapter = new RoleRepository();

const userRepositoryAdapter = new UserRepository();



// B. Initialize Use Cases (Application Layer)

// We inject the infrastructure adapters into the business logic layer

const assignRoleToUserUseCase = new AssignRoleToUserUseCase(

  roleRepositoryAdapter,

  userRepositoryAdapter,

);

const attachPermissionToRoleUseCase = new AttachPermissionToRoleUseCase(

  roleRepositoryAdapter,

);

const createRoleUseCase = new CreateRoleUseCase(roleRepositoryAdapter);

const deleteRoleUseCase = new DeleteRoleUseCase(roleRepositoryAdapter);

const getRoleUseCase = new GetRoleUseCase(roleRepositoryAdapter);

const listRoleUseCase = new ListRoleUseCase(roleRepositoryAdapter);

const removePermissionFromRoleUseCase = new RemovePermissionFromRoleUseCase(

  roleRepositoryAdapter,

);

const removeRoleFromUserUseCase = new RemoveRoleFromUserUserCase(

  userRepositoryAdapter,

);

const updateRoleUseCase = new UpdateRoleUseCase(roleRepositoryAdapter);



// C. Initialize Controller (Presentation/Interface Layer)

// We inject all the configured use cases into the primary controller

export const rbacController = new RbacModuleController(

  assignRoleToUserUseCase,

  attachPermissionToRoleUseCase,

  createRoleUseCase,

  deleteRoleUseCase,

  getRoleUseCase,

  listRoleUseCase,

  removePermissionFromRoleUseCase,

  removeRoleFromUserUseCase,

  updateRoleUseCase,

);import { RoleUpdateProps } from "./domain/Role";

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



import { supabase } from "@/lib/supabase"; // Adjust path as needed

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role } from "../domain/Role";



export class RoleRepository implements IRoleRepository {

  private readonly roleTable = "user_role";

  private readonly permissionTable = "user_role_permission";



  async saveNew(role: Role): Promise<Role> {

    const { id, name, description, permissions } = role.props;



    // 1. Insert the base role

    const { error: roleError } = await supabase

      .from(this.roleTable)

      .insert({ id, name, description });



    if (roleError) throw new Error(`Failed to save role: ${roleError.message}`);



    // 2. Insert associated permissions if any

    if (permissions.length > 0) {

      const permissionRows = permissions.map((p) => ({

        role_id: id,

        resource: p.resource,

        action: p.action,

      }));



      const { error: permError } = await supabase

        .from(this.permissionTable)

        .insert(permissionRows);



      if (permError) throw new Error(`Failed to save permissions: ${permError.message}`);

    }



    return role;

  }



  async persistUpdates(role: Role): Promise<Role> {

    const { id, name, description, permissions } = role.props;



    // 1. Update the base role details

    const { error: roleError } = await supabase

      .from(this.roleTable)

      .update({ name, description })

      .eq("id", id);



    if (roleError) throw new Error(`Failed to update role: ${roleError.message}`);



    // 2. Sync permissions (Simplest approach: wipe and replace)

    const { error: deletePermError } = await supabase

      .from(this.permissionTable)

      .delete()

      .eq("role_id", id);



    if (deletePermError) throw new Error(`Failed to clear old permissions: ${deletePermError.message}`);



    if (permissions.length > 0) {

      const permissionRows = permissions.map((p) => ({

        role_id: id,

        resource: p.resource,

        action: p.action,

      }));



      const { error: insertPermError } = await supabase

        .from(this.permissionTable)

        .insert(permissionRows);



      if (insertPermError) throw new Error(`Failed to insert new permissions: ${insertPermError.message}`);

    }



    return role;

  }



  async findByName(name: string): Promise<Role> {

    const { data, error } = await supabase

      .from(this.roleTable)

      .select(`*, user_role_permission(resource, action)`)

      .eq("name", name)

      .single();



    if (error || !data) throw new Error(`Role not found: ${name}`);



    // Reconstruct the domain entity

    return Role.hydrate({

      id: data.id,

      name: data.name,

      description: data.description,

      permissions: data.user_role_permission || [],

    });

  }



  async deleteByName(name: string): Promise<void> {

    const { error } = await supabase

      .from(this.roleTable)

      .delete()

      .eq("name", name);



    if (error) throw new Error(`Failed to delete role: ${error.message}`);

  }



  async listRoles(pageNumber: number, pageSize: number): Promise<{ list: Role[]; count: number }> {

    const from = (pageNumber - 1) * pageSize;

    const to = from + pageSize - 1;



    const { data, error, count } = await supabase

      .from(this.roleTable)

      .select(`*, user_role_permission(resource, action)`, { count: "exact" })

      .range(from, to);



    if (error) throw new Error(`Failed to list roles: ${error.message}`);



    const roles = (data || []).map((row) =>

      Role.hydrate({

        id: row.id,

        name: row.name,

        description: row.description,

        permissions: row.user_role_permission || [],

      })

    );



    return {

      list: roles,

      count: count || 0,

    };

  }

}import { supabase } from "@/lib/supabase"; // Adjust path as needed

import { IUserRepository } from "../domain/IUserRepository";

import { User } from "../domain/User";



export class UserRepository implements IUserRepository {

  private readonly userTable = "user";

  private readonly junctionTable = "user_role_junction";



  async findById(userId: string): Promise<User> {

    // We only need to fetch the role name now, drastically simplifying the query

    const { data, error } = await supabase

      .from(this.userTable)

      .select(

        `

        id,

        user_role_junction(

          user_role(

            name

          )

        )

      `,

      )

      .eq("id", userId)

      .single();



    if (error || !data) throw new Error(`User not found: ${userId}`);



    // Map the deep-joined data back into an array of strings (role names)

    const roleNames: string[] = (data.user_role_junction || [])

      .map((junction: any) => junction.user_role?.name)

      .filter(Boolean);



    // Reconstruct the User domain entity

    return User.hydrate({

      id: data.id,

      roles: roleNames,

    });

  }



  async persistUpdates(user: User): Promise<boolean> {

    const { id: userId, roles: roleNames } = user.props;



    // 1. Wipe existing relations

    const { error: deleteError } = await supabase

      .from(this.junctionTable)

      .delete()

      .eq("user_id", userId);



    if (deleteError)

      throw new Error(`Failed to clear old user roles: ${deleteError.message}`);



    // 2. Insert current roles

    if (roleNames.length > 0) {

      // Since the User entity only holds role names now, we must fetch the corresponding role IDs

      const { data: roleRecords, error: roleLookupError } = await supabase

        .from("user_role")

        .select("id")

        .in("name", roleNames);



      if (roleLookupError) {

        throw new Error(`Failed to lookup role IDs: ${roleLookupError.message}`);

      }



      const junctionRows = (roleRecords || []).map((role) => ({

        user_id: userId,

        role_id: role.id,

      }));



      const { error: insertError } = await supabase

        .from(this.junctionTable)

        .insert(junctionRows);



      if (insertError)

        throw new Error(

          `Failed to insert new user roles: ${insertError.message}`,

        );

    }



    return true;

  }

}



above is an example of a nicely imlemented module using clean architecture. 





import { describe, expect, it,beforeEach} from "vitest";

import { MockFileRepository } from "../infrastructure/MockFileRepository";

import { MockFileStorage } from "../infrastructure/MockFileStorage";

import { DeleteFileById } from "../useCases/DeleteFileById";

import { UploadFile } from "../useCases/UploadFile";

import { FileBuffer } from "../domain/FileBuffer";

import { IFileRepository } from "../domain/IFileRepository";

import { IFileStorage } from "../domain/IFileStorage"; 



let fileRepository: IFileRepository;

let fileStorage: IFileStorage;

let uploadFileUseCase: UploadFile;

let deleteFileByIdUseCase: DeleteFileById;



const initializeInstances = () => {

  fileRepository = new MockFileRepository();

  fileStorage = new MockFileStorage();

  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);

  deleteFileByIdUseCase = new DeleteFileById(fileRepository, fileStorage);

};



describe("deleteFileByIdUseCase", () => {

  beforeEach(initializeInstances);



  it("returns true if file is deleted", async () => {

    const fileBuffer = new FileBuffer(

      new ArrayBuffer(0),

      "filename",

      "filetype",

    );

    const sampleFileToDelete = await uploadFileUseCase.execute(

      fileBuffer,

      "filename",

      "filedescription",

      "file/path",

    );

    const result = await deleteFileByIdUseCase.execute(

      sampleFileToDelete.props.id,

    );



    expect(result).toBe(true);

  });



  it("returns true if file is not found but no other errors occured", async () => {

    const result = await deleteFileByIdUseCase.execute(

      "id of file that doesnt exist",

    );



    expect(result).toBe(true);

  });

});



import { describe, expect, it, beforeEach } from "vitest";

import { MockFileRepository } from "../infrastructure/MockFileRepository";

import { MockFileStorage } from "../infrastructure/MockFileStorage";

import { DeleteFileById } from "../useCases/DeleteFileById";

import { UploadFile } from "../useCases/UploadFile";

import { FileBuffer } from "../domain/FileBuffer";

import { IFileRepository } from "../domain/IFileRepository";

import { IFileStorage } from "../domain/IFileStorage";

import { GetOneFileById } from "../useCases/GetOneFileById";



let fileRepository: IFileRepository;

let fileStorage: IFileStorage;

let uploadFileUseCase: UploadFile;

let deleteFileByIdUseCase: DeleteFileById;

let getOneFileByIdUseCase: GetOneFileById;



const initializeInstances = () => {

  fileRepository = new MockFileRepository();

  fileStorage = new MockFileStorage();

  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);

  deleteFileByIdUseCase = new DeleteFileById(fileRepository, fileStorage);

  getOneFileByIdUseCase = new GetOneFileById(fileRepository);

};



describe("getOneFileByIdUseCase", () => {

  beforeEach(initializeInstances);



  it("returns a file if it exists", async () => {

    const fileBuffer = new FileBuffer(

      new ArrayBuffer(0),

      "filename",

      "filetype",

    );

    const exampleUploadedFile = await uploadFileUseCase.execute(

      fileBuffer,

      "filename",

      "filedescription",

      "file/path",

    );



    const result = await getOneFileByIdUseCase.execute(

      exampleUploadedFile.props.id,

    );



    expect(result.props.id).toBe(exampleUploadedFile.props.id);

    expect(result.props.fileName).toBe(exampleUploadedFile.props.fileName);

    expect(result.props.fileDescription).toBe(

      exampleUploadedFile.props.fileDescription,

    );

  });



  it("throws an error if file doesnt exist", async () => {

    const call = async () =>

      await getOneFileByIdUseCase.execute("id of file that doesnt exist");



    await expect(call).rejects.toThrow();

  });

});





above is an example of a nicely implemented test. 







# your task is to create a new version of the module below and convert it into clean architcture. do not reference the old module as it will be deleted. make the tests as well. make sure that you cover all use cases and give them to me to copy paste. it should be complete. the tests should be complete. each use case should have its own file. tests should be full coverage which will cover all possible cases related to the use case. the tests are important . make sure that the tests are very comprehensive and complete. i am putting very high emphasis on the tests. modules can have only one controller











