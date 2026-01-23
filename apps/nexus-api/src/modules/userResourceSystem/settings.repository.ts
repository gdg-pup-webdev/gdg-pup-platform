import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type settingsRow = Tables<"user_settings">;
type settingsInsert = TablesInsert<"user_settings">;
type settingsUpdate = TablesUpdate<"user_settings">;

export class SettingsRepository {
  tableName = "user_settings";

  constructor() {}

  listSettingsOfUser = async (
    userId: string,
  ): RespositoryResultList<settingsRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  listSettings = async (): RespositoryResultList<settingsRow> => {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });
    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  getOneSettings = async (id: string): RepositoryResult<settingsRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  createSettings = async (
    dto: settingsInsert,
  ): RepositoryResult<settingsRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  deleteSettings = async (id: string): RepositoryResult<settingsRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  updateSettings = async (
    id: string,
    dto: settingsUpdate,
  ): RepositoryResult<settingsRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };
}

export const settingsRepositoryInstance = new SettingsRepository();
