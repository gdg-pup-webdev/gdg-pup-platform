import { supabase } from "@/v1/lib/supabase";
import { RepositoryResultList } from "@/v1/types/repository.types";
import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch } from "../domain/GdgMerch";

export class SupabaseGdgMerchRepository implements IGdgMerchRepository {
  private readonly tableName = "gdg_merch";

  /**
   * Maps a raw Supabase DB row to a GdgMerch domain object.
   */
  private mapToDomain(row: {
    id: string;
    name: string | null;
    image_url: string | null;
    points_cost: number | null;
    stock: string | null;
    created_at: string | null;
    updated_at: string | null;
  }): GdgMerch {
    return GdgMerch.hydrate({
      id: row.id,
      name: row.name ?? "",
      image: row.image_url ?? "",
      points: row.points_cost ?? 0,
      stock: typeof row.stock === "string" ? parseInt(row.stock, 10) || 0 : (row.stock ?? 0),
      createdAt: new Date(row.created_at ?? Date.now()),
      updatedAt: new Date(row.updated_at ?? Date.now()),
    });
  }

  /**
   * Maps a GdgMerch domain object to a Supabase DB row.
   */
  private mapToDb(merch: GdgMerch) {
    const props = merch.props;
    return {
      id: props.id,
      name: props.name,
      image_url: props.image,
      points_cost: props.points,
      stock: String(props.stock),
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
    };
  }

  async findById(id: string): Promise<GdgMerch | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async list(pageNumber: number, pageSize: number): RepositoryResultList<GdgMerch> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data ?? []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }

  async saveNew(merch: GdgMerch): Promise<GdgMerch> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(this.mapToDb(merch))
      .select()
      .single();

    if (error) throw new Error(`Failed to create GDG Merch: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(merch: GdgMerch): Promise<GdgMerch> {
    const row = this.mapToDb(merch);
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        name: row.name,
        image_url: row.image_url,
        points_cost: row.points_cost,
        stock: row.stock,
      })
      .eq("id", merch.props.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update GDG Merch: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete GDG Merch: ${error.message}`);
  }
}
