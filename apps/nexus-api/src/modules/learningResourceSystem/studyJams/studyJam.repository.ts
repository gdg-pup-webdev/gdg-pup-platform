import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type tableRow = Tables<"study_jam">;
type tableUpdate = TablesUpdate<"study_jam">;
type tableInsert = TablesInsert<"study_jam">;

export class StudyJamRepository {
  tableName = "study_jam";

  constructor() {}

  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  delete = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  update = async (
    resourceId: string,
    dto: tableUpdate,
  ): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  list = async (): RepositoryResultList<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false });

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

  getOne = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", resourceId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const studyJamRepositoryInstance = new StudyJamRepository();
