import { supabase } from "@/v1/lib/supabase";
import { User } from "../domain/User";
import { ICustomAuthRepository } from "../domain/IAuthenticationInterfaces";

export class SupabaseUserCredentialRepository implements ICustomAuthRepository {
  private readonly tableName = "user_credentials";

  private mapToDomain(row: any): User {
    return User.hydrate({
      id: row.id,
      username: row.username,
      emailAddress: row.email_address,
      passwordHash: row.password_hash,
      otpCode: row.otp_code,
      otpExpiresAt: row.otp_expires_at ? new Date(row.otp_expires_at) : null,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("email_address", email)
      .maybeSingle();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async saveNew(user: User): Promise<User> {
    const p = user.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: p.id,
        username: p.username,
        email_address: p.emailAddress,
        password_hash: p.passwordHash,
        otp_code: p.otpCode,
        otp_expires_at: p.otpExpiresAt?.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save user: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(user: User): Promise<User> {
    const p = user.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        username: p.username,
        email_address: p.emailAddress,
        password_hash: p.passwordHash,
        otp_code: p.otpCode,
        otp_expires_at: p.otpExpiresAt?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return this.mapToDomain(data);
  }

  async deleteByUsername(username: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("username", username);

    if (error) throw new Error(`Failed to delete user: ${error.message}`);
    return true;
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
