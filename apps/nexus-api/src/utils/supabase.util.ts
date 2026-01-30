import { DatabaseError } from "@/classes/ServerError";
import { supabase } from "@/lib/supabase";

export namespace SupabaseUtils {
  export const listRowsByFilter = async (
    tableName: string,
    pageNumber: number,
    pageSize: number,
    filters?: Record<string, any>,
    options?: {
      orderBy?: string;
      orderDirection?: "asc" | "desc";
    },
  ) => {
    let query = supabase.from(tableName).select("*", { count: "exact" });

    // Enforcing filters
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    // Applying options
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection === "asc",
      });
    }

    // Applying pagination
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Await
    const { data, error, count } = await query;

    if (error) throw error;
    return { list: data, count: count || 0 };
  };

  export const listRows = async (
    tablename: string,
    pageNumber: number,
    pageSize: number,
  ) => {
    const { data, error, count } = await supabase
      .from(tablename)
      .select("*", { count: "exact" })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);
    if (error) throw new DatabaseError(error.message);
    return { list: data, count: count || 0 };
  };

  export const getOneRow = async (tablename: string, id: string) => {
    const { data, error } = await supabase
      .from(tablename)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  export const createRow = async (tablename: string, dto: any) => {
    const { data, error } = await supabase
      .from(tablename)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  export const updateRow = async (tablename: string, id: string, dto: any) => {
    const { data, error } = await supabase
      .from(tablename)
      .update(dto)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  export const deleteRow = async (tablename: string, id: string) => {
    const { data, error } = await supabase
      .from(tablename)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  };
}
