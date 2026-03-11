import { Role } from "./Role";

export abstract class IRoleRepository {
  abstract saveNew(role: Role): Promise<Role>;
  abstract persistUpdates(role: Role): Promise<Role>;
  abstract findByName(name: string): Promise<Role>;
  abstract findById (id: string): Promise<Role>;
  abstract deleteByName(name: string): Promise<void>;
  abstract deleteById(id: string): Promise<void>;
  abstract listRoles(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Role[]; count: number }>;
}
