import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { Database } from "../types/supabase.types";

 type TableWithId = {
  [K in keyof Database["public"]["Tables"]]: Database["public"]["Tables"][K]["Row"] extends { id: any } 
    ? K 
    : never
}[keyof Database["public"]["Tables"]];

export namespace SupabaseUtils {
  export const listRowsByFilter = async <
    T extends keyof Database["public"]["Tables"]
  >(
    tableName: T,
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

    if (error) handlePostgresError(error);

    return { list: data, count: count || 0 };
  };

  export const listRows = async <
    T extends keyof Database["public"]["Tables"]
  >(
    tablename: T,
    pageNumber: number,
    pageSize: number,
  ) => {
    const { data, error, count } = await supabase
      .from(tablename)
      .select("*", { count: "exact" })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);
    if (error) handlePostgresError(error);
    return { list: data, count: count || 0 };
  };

  export const getOneRow = async <T extends TableWithId>(tablename: T, id: string) => {
    const { data, error } = await supabase
      .from(tablename)
      .select("*")
      .eq("id" as any, id)
      .single();
    if (error) handlePostgresError(error);
    return data;
  };

  export const createRow = async <
    T extends keyof Database["public"]["Tables"]
  >(tablename: T, dto: any) => {
    const { data, error } = await supabase
      .from(tablename)
      .insert(dto)
      .select("*")
      .single();
    if (error) handlePostgresError(error);
    return data;
  };

  export const updateRow = async <T extends TableWithId>(
    tablename: T,
    id: string,
    dto: Database["public"]["Tables"][T]["Update"]
  ) => {
    const { data, error } = await supabase
      .from(tablename)
      // We cast the column name to any to satisfy the complex internal Supabase Filter type
      .update(dto as any)
      .eq("id" as any, id) 
      .select("*")
      .maybeSingle();

    if (error) handlePostgresError(error);
    return data;
  };

  export const deleteRow = async <T extends TableWithId>(
    tablename: T,
    id: string
  ) => {
    const { data, error } = await supabase
      .from(tablename)
      .delete()
      .eq("id" as any, id)
      .select("*")
      .single();

    if (error) handlePostgresError(error);
    return data;
  };
}
