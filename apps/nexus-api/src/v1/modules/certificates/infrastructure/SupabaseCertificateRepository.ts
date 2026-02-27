 import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate } from "../domain/Certificate";
import { supabase } from "@/v1/lib/supabase";

export class SupabaseCertificateRepository implements ICertificateRepository {
  private readonly tableName = "user_certificate";

  private mapToDomain(row: any): Certificate {
    return Certificate.hydrate({
      id: row.id,
      userId: row.user_id,
      title: row.title || "",
      description: row.description || "",
      imageUrl: row.image_url,
      issuedAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<Certificate | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(filters: { userId?: string } = {}, pageNumber = 1, pageSize = 10): Promise<{ list: Certificate[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" }).order("created_at", { ascending: false });

    if (filters.userId) query = query.eq("user_id", filters.userId);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.range(from, from + pageSize - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }

  async saveNew(certificate: Certificate): Promise<Certificate> {
    const props = certificate.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      user_id: props.userId,
      title: props.title,
      description: props.description,
      image_url: props.imageUrl,
      created_at: props.issuedAt.toISOString(),
    }).select().single();

    if (error) throw new Error(`Failed to create certificate: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(certificate: Certificate): Promise<Certificate> {
    const props = certificate.props;
    const { data, error } = await supabase.from(this.tableName).update({
      title: props.title,
      description: props.description,
      image_url: props.imageUrl,
    }).eq("id", props.id).select().single();

    if (error) throw new Error(`Failed to update certificate: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete certificate: ${error.message}`);
  }
}