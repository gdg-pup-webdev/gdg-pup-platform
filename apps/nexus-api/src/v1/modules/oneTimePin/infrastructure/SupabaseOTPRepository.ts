import { supabase } from "@/v1/lib/supabase";
import { OneTimePin } from "../domain/OneTimePin";
import { IOTPRepository } from "../domain/IOneTimePinInterfaces";

export class SupabaseOTPRepository implements IOTPRepository {
  private readonly tableName = "one_time_pins";

  private mapToDomain(row: any): OneTimePin {
    return OneTimePin.hydrate({
      reference: row.reference,
      email: row.email,
      otpCode: row.otp_code,
      expiresAt: new Date(row.expires_at),
      isUsed: row.is_used,
    });
  }

  async findByReference(reference: string): Promise<OneTimePin | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("reference", reference)
      .maybeSingle();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async saveNew(otp: OneTimePin): Promise<OneTimePin> {
    const p = otp.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        reference: p.reference,
        email: p.email,
        otp_code: p.otpCode,
        expires_at: p.expiresAt.toISOString(),
        is_used: p.isUsed,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save OTP: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(otp: OneTimePin): Promise<OneTimePin> {
    const p = otp.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        is_used: p.isUsed,
      })
      .eq("reference", p.reference)
      .select()
      .single();

    if (error) throw new Error(`Failed to update OTP: ${error.message}`);
    return this.mapToDomain(data);
  }
}
