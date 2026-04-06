import { supabase } from "@/v1/lib/supabase";
import { InternalServerError } from "@/v1/errors/HttpError";
import type { Database } from "@/v1/types/supabase.types";
import { IProductRepository } from "../domain/IProductRepository";
import { Product } from "../domain/Product";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export class SupabaseProductRepository implements IProductRepository {
  private readonly tableName = "products" as const;

  /**
   * Maps a raw Supabase DB row to a Product domain object.
   */
  private mapToDomain(row: ProductRow): Product {
    return Product.hydrate({
      id: row.id,
      name: row.name ?? "",
      description: row.description ?? "",
      category: row.category ?? "",
      image: row.image ?? "",
      link: row.link ?? undefined,
      createdAt: new Date(row.created_at ?? Date.now()),
      updatedAt: new Date(row.updated_at ?? Date.now()),
    });
  }

  /**
   * Maps a Product domain object to a Supabase DB row.
   */
  private mapToDb(product: Product): ProductInsert {
    const props = product.props;
    return {
      id: props.id,
      name: props.name,
      description: props.description,
      category: props.category,
      image: props.image,
      link: props.link || null,
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
    };
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new InternalServerError(
        "Failed to fetch product from database",
        error,
      );
    }
    return data ? this.mapToDomain(data) : null;
  }

  async list(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ products: Product[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      throw new InternalServerError(
        "Failed to list products from database",
        error,
      );
    }

    return {
      products: (data ?? []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }

  async saveNew(product: Product): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .insert(this.mapToDb(product));

    if (error) {
      throw new InternalServerError("Failed to create product", error);
    }
  }

  async persistUpdates(product: Product): Promise<void> {
    const row = this.mapToDb(product);
    const { error } = await supabase
      .from(this.tableName)
      .update({
        name: row.name,
        description: row.description,
        category: row.category,
        image: row.image,
        link: row.link,
        updated_at: row.updated_at,
      })
      .eq("id", product.props.id);

    if (error) {
      throw new InternalServerError("Failed to update product", error);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    if (error) {
      throw new InternalServerError("Failed to delete product", error);
    }
  }
}
