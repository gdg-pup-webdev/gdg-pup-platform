import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";

export class BaseRepository<T, I, U> {
  constructor(protected tableName: string) {}

  private async handleResponse<R>(promise: any): Promise<R> {
    const { data, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return data as R;
  }

  private async handleListResponse(promise: any): RespositoryResultList<T> {
    const { data, count, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return {
      list: (data as T[]) || [],
      count: count || 0,
    };
  }

  listByUser = async (userId: string): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("user_id", userId)
    );
  };

  listAll = async (): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase.from(this.tableName).select("*", { count: "exact" })
    );
  };

  getOne = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).select("*").eq("id", id).single()
    );
  };

  create = async (dto: I): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).insert(dto as any).select("*").single()
    );
  };

  update = async (id: string, dto: U): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).update(dto as any).eq("id", id).select("*").single()
    );
  };

  delete = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).delete().eq("id", id).select("*").single()
    );
  };
}
