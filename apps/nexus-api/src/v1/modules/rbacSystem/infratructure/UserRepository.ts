 import { supabase } from "@/v1/lib/supabase";
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