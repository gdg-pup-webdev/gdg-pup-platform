import {
  ServerError_DEPRECATED,
} from "@/classes/ServerError.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError";
import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { models } from "@packages/nexus-api-contracts";

type tableRow = Tables<"external_resource">;
type tableUpdate = TablesUpdate<"external_resource">;
type tableInsert = TablesInsert<"external_resource">;

export class ExternalResourceRepository {
  tableName = "external_resource";

  constructor() {}

  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  delete = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

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

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  list = async (): RepositoryResultList<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError_DONT_USE(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError_DONT_USE(countError.message);

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

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };
}

export const externalResourceRepositoryInstance =
  new ExternalResourceRepository();
