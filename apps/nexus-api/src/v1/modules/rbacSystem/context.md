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

}

import { User } from "./User";

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

\_props: RoleProps;

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

roles: Role[];

};

export class User {

\_props: UserProps;

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

    this._props.roles.push(role);

};

detachRole = (roleName: string) => {

    this._props.roles = this._props.roles.filter((role) => {

      return role.props.name !== roleName;

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

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role } from "../domain/Role";

export class GetRoleUseCase {

constructor(private readonly roleRepository: IRoleRepository) {}

async execute(roleName: string) {

    const role = await this.roleRepository.findByName(roleName);



    return role;

}

}

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role } from "../domain/Role";

export class ListRoleUseCase {

constructor(private readonly roleRepository: IRoleRepository) {}

async execute(pageNumber: number, pageSize: number) {

    const result = await this.roleRepository.listRoles(pageNumber, pageSize);



    return result;

}

}

import { IRoleRepository } from "../domain/IRoleRepository";

export class RemovePermissionFromRoleUseCase {

constructor(private readonly roleRepository: IRoleRepository) {}

async execute(roleName: string, resource: string, action: string) {

    const role = await this.roleRepository.findByName(roleName);

    await role.detachPermission(resource, action);

    await this.roleRepository.persistUpdates(role);

    return role;

}

}

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

import { IRoleRepository } from "../domain/IRoleRepository";

import { Role, RoleUpdateProps } from "../domain/Role";

export class UpdateRoleUseCase {

constructor(private readonly roleRepository: IRoleRepository) {}

async execute(name: string, dto: RoleUpdateProps) {

    const role = await this.roleRepository.findByName(name);

    role.update(dto);

    await this.roleRepository.persistUpdates(role);



    return role;

}

}
