 import { supabase } from "@/v1/lib/supabase";
import { IRoleRepository } from "../domain/IRoleRepository";
import { Role } from "../domain/Role";

export class RoleRepository implements IRoleRepository {
  private readonly roleTable = "user_role";
  private readonly permissionTable = "user_role_permission";

  async deleteById(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete role: ${error.message}`);
  }

  async findById(id: string): Promise<Role> {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission(resource, action)`)
      .eq("id", id)
      .single();

    if (error || !data) throw new Error(`Role not found: ${id}`);

    // Reconstruct the domain entity
    return Role.hydrate({
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: data.user_role_permission || [],
    });
  }

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
}