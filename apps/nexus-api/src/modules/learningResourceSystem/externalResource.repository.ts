import { DatabaseError, ServerError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

/**
 * Repositories are interface between the database and the services.
 * They either throw errors or return data. 
 * Errors must be handled by the caller
 * 
 * 
 * EXTERNAL RESOURCE TABLE STRUCTURE
    created_at?: string | undefined;
    description?: string | null | undefined;
    id?: string | undefined;
    resource_url: string;
    title: string;
    updated_at?: string | undefined;
    uploader_id: string;
 */

type tableInsert = Omit<
  TablesInsert<"external_resource">,
  "id" | "created_at" | "updated_at"
>;
type tableRow = Tables<"external_resource">;
type tableUpdate = Partial<tableInsert>;
const tableName = "external_resource";
const repositoryName = "externalResourceRepository";

export class ExternalResourceRepository {
  constructor() {}

  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error)
      throw new DatabaseError(
        repositoryName,
        tableName,
        "create",
        error.message,
      );

    return data;
  };

  delete = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error)
      throw new DatabaseError(
        repositoryName,
        tableName,
        "delete",
        error.message,
      );

    return data;
  };

  update = async (
    resourceId: string,
    dto: tableUpdate,
  ): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(tableName)
      .update(dto)
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error)
      throw new DatabaseError(
        repositoryName,
        tableName,
        "update",
        error.message,
      );

    return data;
  };

  list = async (): RespositoryResultList<tableRow> => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error)
      throw new DatabaseError(repositoryName, tableName, "list", error.message);

    const { count, error: countError } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (countError)
      throw new DatabaseError(
        repositoryName,
        tableName,
        "count",
        countError.message,
      );

    return {
      list: data,
      count: count || 0,
    };
  };

  getOne = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", resourceId)
      .single();

    if (error)
      throw new DatabaseError(
        repositoryName,
        tableName,
        "getOne",
        error.message,
      );
    return data;
  };
}

export const learningResourceRepositoryInstance =
  new ExternalResourceRepository();
