import { SupabaseClient } from "@supabase/supabase-js";
import { IUserCredentialRepository } from "../domain/IAuthenticationInterfaces";
import { UserCredential } from "../domain/UserCredential";

export class SupabaseUserCredentialRepository implements IUserCredentialRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async saveNew(credential: UserCredential): Promise<UserCredential> {
    const { data, error } = await this.supabase
      .from("user_credential")
      .insert({
        id: credential.props.id,
        email_address: credential.props.emailAddress,
        username: credential.props.username,
        password_hash: credential.props.passwordHash,
      })
      .select()
      .single();

    if (error) throw error;
    return UserCredential.hydrate({
      id: data.id,
      emailAddress: data.email_address,
      username: data.username,
      passwordHash: data.password_hash,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async persistUpdates(credential: UserCredential): Promise<UserCredential> {
    const { data, error } = await this.supabase
      .from("user_credential")
      .update({
        email_address: credential.props.emailAddress,
        username: credential.props.username,
        password_hash: credential.props.passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", credential.props.id)
      .select()
      .single();

    if (error) throw error;
    return UserCredential.hydrate({
      id: data.id,
      emailAddress: data.email_address,
      username: data.username,
      passwordHash: data.password_hash,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async findByEmail(email: string): Promise<UserCredential | null> {
    const { data, error } = await this.supabase
      .from("user_credential")
      .select()
      .eq("email_address", email)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return UserCredential.hydrate({
      id: data.id,
      emailAddress: data.email_address,
      username: data.username,
      passwordHash: data.password_hash,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("user_credential")
      .delete()
      .eq("email_address", email);

    if (error) throw error;
    return true;
  }
}
