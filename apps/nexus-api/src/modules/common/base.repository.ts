/**
 * @file base.repository.ts
 * @description Provides a generic abstract repository class for standard CRUD operations 
 * using Supabase. This class reduces boilerplate by centralizing logic for database 
 * interactions and error handling.
 */

import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";

/**
 * BaseRepository Class
 * @template T - The Row type representing the database record.
 * @template I - The Insert type for creating new records.
 * @template U - The Update type for modifying existing records.
 */
export class BaseRepository<T, I, U> {
  /**
   * @param tableName - The name of the Supabase table this repository manages.
   */
  constructor(protected readonly tableName: string) {}

  /**
   * handleResponse
   * Standardizes the extraction of data from a single-record Supabase query.
   * @param promise - The Supabase query promise.
   * @throws {DatabaseError} - Throws if the query returns an error.
   */
  private async handleResponse<R>(promise: any): Promise<R> {
    const { data, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return data as R;
  }

  /**
   * handleListResponse
   * Standardizes the extraction of data and record counts from list-based Supabase queries.
   * @param promise - The Supabase query promise.
   * @throws {DatabaseError} - Throws if the query returns an error.
   */
  private async handleListResponse(promise: any): RespositoryResultList<T> {
    const { data, count, error } = await promise;
    if (error) throw new DatabaseError(error.message);
    return {
      list: (data as T[]) || [],
      count: count || 0,
    };
  }

  /**
   * listByUser
   * Fetches all records belonging to a specific user.
   * @param userId - The ID of the user owning the resources.
   */
  listByUser = async (userId: string): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("user_id", userId)
    );
  };

  /**
   * listAll
   * Fetches all records from the table with total count.
   */
  listAll = async (): RespositoryResultList<T> => {
    return this.handleListResponse(
      supabase.from(this.tableName).select("*", { count: "exact" })
    );
  };

  /**
   * getOne
   * Fetches a single record by its primary key ID.
   * @param id - The ID of the record.
   */
  getOne = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).select("*").eq("id", id).single()
    );
  };

  /**
   * create
   * Inserts a new record into the table.
   * @param dto - The data to insert.
   */
  create = async (dto: I): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).insert(dto as any).select("*").single()
    );
  };

  /**
   * update
   * Modifies an existing record by its ID.
   * @param id - The ID of the record to update.
   * @param dto - The partial data to update.
   */
  update = async (id: string, dto: U): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).update(dto as any).eq("id", id).select("*").single()
    );
  };

  /**
   * delete
   * Removes a record from the table by its ID.
   * @param id - The ID of the record to delete.
   */
  delete = async (id: string): RepositoryResult<T> => {
    return this.handleResponse(
      supabase.from(this.tableName).delete().eq("id", id).select("*").single()
    );
  };
}