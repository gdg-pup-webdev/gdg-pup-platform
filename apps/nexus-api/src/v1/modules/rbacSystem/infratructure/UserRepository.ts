import { supabase } from "@/v1/lib/supabase";
import { InternalServerError, NotFoundError } from "@/v1/errors/HttpError";
import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";
import { Role } from "../domain/Role";

export class UserRepository implements IUserRepository {
  private readonly userTable = "gdg_members";
  private readonly junctionTable = "user_role_junction";

  async findById(gdgId: string): Promise<User> {
    // Step 1: Ensure the user exists in the app user table.
    const { data: userRow, error: userError } = await supabase
      .from(this.userTable)
      .select("*")
      .eq("gdg_id", gdgId)
      .single();

    if (userError) {
      throw new InternalServerError(
        `Failed to query user '${gdgId}' from table '${this.userTable}'.`,
        userError,
      );
    }

    if (!userRow) {
      throw new NotFoundError(`User not found: ${gdgId}`);
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
      .eq("user_id", gdgId);

    if (junctionError) {
      throw new InternalServerError(
        `Failed to load roles and permissions for user: ${gdgId}`,
        junctionError,
      );
    }

    const roleNames: string[] = [];
    const rolesWithPermissions: Role[] = [];

    // Map role relations back into domain entities.
    const junctions = junctionRows || [];

    for (const junction of junctions) {
      const roleData = junction.user_role;

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
      gdgId: userRow.gdg_id,
      roles: roleNames,
      rolesWithPermissions,
    });
  }

  async persistUpdates(user: User): Promise<boolean> {
    const { gdgId, roles: roleNames } = user.props;

    // 1. Wipe existing relations
    const { error: deleteError } = await supabase
      .from(this.junctionTable)
      .delete()
      .eq("gdg_id", gdgId);

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
        gdg_id: gdgId,
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
