 import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type tableRow = Tables<"external_resource">;
type tableUpdate = TablesUpdate<"external_resource">;
type tableInsert = TablesInsert<"external_resource">;

/**
 * Filters for listing external resources.
 */
export type ExternalResourceListFilters = {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  uploaderId?: string;
  tagIds?: string[];
};

/**
 * Repository for managing external resources in the database.
 */
export class ExternalResourceRepository {
  private readonly tableName = "external_resource";

  /**
   * Creates a new external resource.
   * @returns The created resource.
   * @throws {DatabaseError} If the database operation fails.
   */
  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * Deletes an external resource.
   * @param resourceId - The ID of the resource to delete.
   * @returns The deleted resource.
   * @throws {DatabaseError} If the database operation fails.
   */
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

  /**
   * Updates an external resource.
   * @returns The updated resource.
   * @throws {DatabaseError} If the database operation fails.
   */
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

  /**
   * Lists external resources with pagination and filtering.
   * @returns A list of resources and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
    filters: ExternalResourceListFilters,
  ): RepositoryResultList<tableRow> => {
    const from = (pageNumber - 1) * pageSize;
    const to = pageNumber * pageSize - 1;

    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const term = filters.search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }

    if (filters.createdFrom) {
      query = query.gte("created_at", filters.createdFrom);
    }

    if (filters.createdTo) {
      query = query.lte("created_at", filters.createdTo);
    }

    if (filters.uploaderId) {
      query = query.eq("uploader_id", filters.uploaderId);
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      const { data: taggedResources, error: tagLookupError } = await supabase
        .from("resource_tag_junction")
        .select("resource_id")
        .in("resource_tag_id", filters.tagIds);

      if (tagLookupError) throw new Error(tagLookupError.message);

      const resourceIds = Array.from(
        new Set((taggedResources ?? []).map(({ resource_id }) => resource_id)),
      );

      if (resourceIds.length === 0) {
        return {
          list: [],
          count: 0,
        };
      }

      query = query.in("id", resourceIds);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };

  /**
   * Gets a single external resource by its ID.
   * @param resourceId - The ID of the resource to fetch.
   * @returns The fetched resource.
   * @throws {DatabaseError} If the database operation fails.
   */
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
