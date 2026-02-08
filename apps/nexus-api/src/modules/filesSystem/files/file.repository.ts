import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";

type ListParams = {
  pageNumber: number;
  pageSize: number;
};

export class FileRepository {
  private readonly table = "file";

  async create(dto: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select("*")
      .single();

    if (error) {
      throw new DatabaseError_DONT_USE(error.message);
    }

    return data;
  }

  async list({ pageNumber, pageSize }: ListParams) {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new DatabaseError_DONT_USE(error.message);
    }

    return {
      list: data ?? [],
      count: count ?? 0,
    };
  }

  async getOne(fileId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", fileId)
      .single();

    if (error) {
      throw new DatabaseError_DONT_USE(error.message);
    }

    return data;
  }

  async update(fileId: string, dto: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq("id", fileId)
      .select("*")
      .single();

    if (error) {
      throw new DatabaseError_DONT_USE(error.message);
    }

    return data;
  }

  async delete(fileId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", fileId)
      .select("*")
      .single();

    if (error) {
      throw new DatabaseError_DONT_USE(error.message);
    }

    return data;
  }
}

export const fileRepositoryInstance = new FileRepository();
