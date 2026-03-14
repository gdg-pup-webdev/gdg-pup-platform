import { supabase } from "@/v1/lib/supabase";
import { InternalServerError, NotFoundError } from "@/v1/errors/HttpError";
import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";
import { Role } from "../domain/Role";

export class UserRepository implements IUserRepository {
  private readonly userTable = "user";
  private readonly junctionTable = "user_role_junction";

  async findById(userId: string): Promise<User> {
    // Step 1: Ensure the user exists in the app user table.
    const { data: userRow, error: userError } = await supabase
      .from(this.userTable)
      .select("id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new InternalServerError(
        `Failed to query user '${userId}' from table '${this.userTable}'.`,
        userError,
      );
    }

    if (!userRow) {
      throw new NotFoundError(`User not found: ${userId}`);
    }

    // Step 2: Load assigned roles and permissions from the junction table.
    const { data: junctionRows, error: junctionError } = await supabase
      .from(this.junctionTable)
      .select(
        `
        user_role(
          id,
          name,
          description,
          user_role_permission(
            resource,
            action
          )
        )
      `,
      )
      .eq("user_id", userId);

    if (junctionError) {
      throw new InternalServerError(
        `Failed to load roles and permissions for user: ${userId}`,
        junctionError,
      );
    }

    const roleNames: string[] = [];
    const rolesWithPermissions: Role[] = [];

    // Map role relations back into domain entities.
    const junctions = junctionRows || [];

    for (const junction of junctions) {
      const roleData = junction.user_role as any;

      if (roleData) {
        roleNames.push(roleData.name);

        rolesWithPermissions.push(
          Role.hydrate({
            id: roleData.id,
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.user_role_permission || [],
          }),
        );
      }
    }

    // Reconstruct the User domain entity with all required props
    return User.hydrate({
      id: userRow.id,
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
        throw new Error(
          `Failed to lookup role IDs: ${roleLookupError.message}`,
        );
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
          `Failed to insert new user roles: ${insertError.message}`,
        );
    }

    return true;
  }
}
