import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type certificateRow = Tables<"user_certificate">;
type certificateInsert = TablesInsert<"user_certificate">;
type certificateUpdate = TablesUpdate<"user_certificate">;

export class CertificateRepository {
  tableName = "user_certificate";

  constructor() {}

  listCertificatesOfUser = async (
    userId: string,
  ): RespositoryResultList<certificateRow> => {
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

  listCertificates = async (): RespositoryResultList<certificateRow> => {
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

  getOneCertificate = async (id: string): RepositoryResult<certificateRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  createCertificate = async (
    dto: certificateInsert,
  ): RepositoryResult<certificateRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  deleteCertificate = async (id: string): RepositoryResult<certificateRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  updateCertificate = async (
    id: string,
    dto: certificateUpdate,
  ): RepositoryResult<certificateRow> => {
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

export const certificateRepositoryInstance = new CertificateRepository();
