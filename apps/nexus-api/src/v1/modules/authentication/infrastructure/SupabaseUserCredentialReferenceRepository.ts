import { SupabaseClient } from "@supabase/supabase-js";
import { IUserCredentialReferenceRepository } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { Database } from "@/v1/types/supabase.types.js";

export class SupabaseUserCredentialReferenceRepository implements IUserCredentialReferenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) { }

  async saveNew(reference: UserCredentialReferenceCode): Promise<UserCredentialReferenceCode> {
    const { data, error } = await this.supabase
      .from("user_credential_reference_code")
      .insert({
        reference_code: reference.props.referenceCode,
        email_address: reference.props.emailAddress,
        payload: reference.props.payload,
        type: reference.props.type,
        otp_reference: reference.props.otpReference,
      })
      .select()
      .single();

    if (error) throw error;
    return UserCredentialReferenceCode.hydrate({
      referenceCode: data.reference_code,
      emailAddress: data.email_address || "",
      payload: (data.payload || {}) as Record<string, any>,
      type: data.type as ReferenceCodeType,
      otpReference: data.otp_reference || "",
      createdAt: new Date(data.created_at || ""),
    });
  }

  async findByReferenceCode(code: string): Promise<UserCredentialReferenceCode | null> {
    const { data, error } = await this.supabase
      .from("user_credential_reference_code")
      .select()
      .eq("reference_code", code)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return UserCredentialReferenceCode.hydrate({
      referenceCode: data.reference_code,
      emailAddress: data.email_address || "",
      payload: (data.payload || {}) as Record<string, any>,
      type: data.type as ReferenceCodeType,
      otpReference: data.otp_reference || "",
      createdAt: new Date(data.created_at || ""),
    });
  }

  async deleteByReferenceCode(code: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("user_credential_reference_code")
      .delete()
      .eq("reference_code", code);

    if (error) throw error;
    return true;
  }
}

