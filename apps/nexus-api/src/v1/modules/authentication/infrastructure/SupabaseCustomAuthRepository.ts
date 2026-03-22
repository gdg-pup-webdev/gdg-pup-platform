import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";
import { ICustomAuthRepository } from "../domain/Interfaces";
import { User } from "../domain/User";

export class SupabaseCustomAuthRepository implements ICustomAuthRepository {
  private readonly TABLE_NAME = "user_credentials";

  private toPersistence(user: User) {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      created_at: user.createdAt?.toISOString(),
    };
  }

  private toDomain(row: any): User {
    try {
      console.log("[AuthRepo] Row data from DB:", JSON.stringify(row));
      const user = User.hydrate({
        id: row.id,
        username: row.username,
        password: row.password,
        createdAt: new Date(row.created_at),
      });
      console.log("[AuthRepo] Hydrated user:", user.username);
      return user;
    } catch (error: any) {
      console.error("[AuthRepo] Failed to hydrate User from DB row:", error.message);
      throw error;
    }
  }

  async saveNew(user: User): Promise<User> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from(this.TABLE_NAME).insert(this.toPersistence(user));
    if (error) throw new Error(`Failed to save user: ${error.message}`);
    return user;
  }

  async persistUpdates(user: User): Promise<User> {
    if (!user.id) throw new Error("User ID is required for updates");
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update(this.toPersistence(user))
      .eq("id", user.id);
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return user;
  }

  async deleteByUsername(username: string): Promise<boolean> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from(this.TABLE_NAME).delete().eq("username", username);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
    return true;
  }

  async findByUsername(username: string): Promise<User | null> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) return null;
    return this.toDomain(data);
  }
}
