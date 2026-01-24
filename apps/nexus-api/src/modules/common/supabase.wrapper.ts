/**
 * @file supabase.wrapper.ts
 * @description A utility wrapper for standard Supabase CRUD operations.
 * This class uses composition to provide database access logic, replacing
 * the need for repository inheritance.
 */

import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * SupabaseWrapper
 * Provides generic, type-safe methods for interacting with a specific Supabase table.
 * @template T - The Row type.
 * @template I - The Insert type.
 * @template U - The Update type.
 */
export class SupabaseWrapper<T, I, U> {
  constructor(private readonly tableName: string) {}

  /**
   * handleResponse
   * Standardizes response handling for single-record queries.
   */
  private async handleResponse<R>(promise: PromiseLike<PostgrestSingleResponse<R>>): Promise<R> {
    const { data, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return data as R;
  }

  /**
   * handleListResponse
   * Standardizes response handling for list queries.
   */
  private async handleListResponse(promise: PromiseLike<PostgrestResponse<T>>): RespositoryResultList<T> {
    const { data, count, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return {
      list: (data as T[]) || [],
      count: count || 0,
    };
  }

  /**
   * listByUser
   * Fetches records filtered by `user_id`.
   */
  listByUser = async (userId: string): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("user_id", userId) as any
    );
  };

  /**
   * listAll
   * Fetches all records.
   */
  listAll = async (): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase.from(this.tableName).select("*", { count: "exact" }) as any
    );
  };

  /**
   * getOne
   * Fetches a single record by ID.
   */
  getOne = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).select("*").eq("id", id).single() as any
    );
  };

  /**
   * create
   * Inserts a new record.
   */
  create = async (dto: I): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).insert(dto as any).select("*").single() as any
    );
  };

  /**
   * update
   * Updates an existing record by ID.
   */
  update = async (id: string, dto: U): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).update(dto as any).eq("id", id).select("*").single() as any
    );
  };

  /**
   * delete
   * Deletes a record by ID.
   */
  delete = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).delete().eq("id", id).select("*").single() as any
    );
  };
}
