import { supabase } from "@/v1/lib/supabase";
import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";
import { Role } from "../domain/Role";

export class UserRepository implements IUserRepository {
  private readonly userTable = "user";
  private readonly junctionTable = "user_role_junction";

  async findById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from(this.userTable)
      .select(
        `
        id,
        user_role_junction(
          user_role(
            id,
            name,
            description,
            user_role_permission(
              resource,
              action
            )
          )
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error || !data) throw new Error(`User not found: ${userId}`);

    const roleNames: string[] = [];
    const rolesWithPermissions: Role[] = [];

    // Map the deep-joined data back into strings and Role domain entities
    const junctions = data.user_role_junction || [];
    
    for (const junction of junctions) {
      // Supabase returns referenced relations as objects or arrays of objects.
      // Type assertion handles the potential single/array return depending on exact PostgREST types.
      const roleData = junction.user_role as any;

      if (roleData) {
        roleNames.push(roleData.name);
        
        rolesWithPermissions.push(
          Role.hydrate({
            id: roleData.id,
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.user_role_permission || [],
          })
        );
      }
    }

    // Reconstruct the User domain entity with all required props
    return User.hydrate({
      id: data.id,
      roles: roleNames,
      rolesWithPermissions,
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
      // Lookup role IDs based on names
      const { data: roleRecords, error: roleLookupError } = await supabase
        .from("user_role")
        .select("id")
        .in("name", roleNames);

      if (roleLookupError) {
        throw new Error(`Failed to lookup role IDs: ${roleLookupError.message}`);
      }

      // Construct rows according to your schema: user_role_junction uses role_id and user_id
      const junctionRows = (roleRecords || []).map((role) => ({
        user_id: userId,
        role_id: role.id,
      }));

      const { error: insertError } = await supabase
        .from(this.junctionTable)
        .insert(junctionRows);

      if (insertError)
        throw new Error(
          `Failed to insert new user roles: ${insertError.message}`
        );
    }

    return true;
  }
}