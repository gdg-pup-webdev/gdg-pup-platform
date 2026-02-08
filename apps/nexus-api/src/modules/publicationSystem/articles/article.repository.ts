import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type tableRow = Tables<"article">;
type tableInsert = TablesInsert<"article">;
type tableUpdate = TablesUpdate<"article">;

type commentRow = Tables<"article_comment">;
type commentInsert = TablesInsert<"article_comment">;

/**
 * Repository for managing articles and their comments in the database.
 */
export class ArticleRepository {
  private readonly tableName = "article";
  private readonly commentTableName = "article_comment";

  /**
   * Creates a new article.
   * @returns The created article.
   * @throws {DatabaseError} If the database operation fails.
   */
  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Lists all articles.
   * @returns A list of articles and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
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

  /**
   * Gets a single article by its ID.
   * @returns The fetched article.
   * @throws {DatabaseError} If the database operation fails.
   */
  getOne = async (articleId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  /**
   * Updates an article.
   * @returns The updated article.
   * @throws {DatabaseError} If the database operation fails.
   */
  update = async (
    articleId: string,
    dto: tableUpdate,
  ): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", articleId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  /**
   * Deletes an article.
   * @returns The deleted article.
   * @throws {DatabaseError} If the database operation fails.
   */
  delete = async (articleId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", articleId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  /**
   * Lists all comments for a given article.
   * @returns A list of comments and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  listComments = async (
    articleId: string,
  ): RepositoryResultList<commentRow> => {
    const { data, error } = await supabase
      .from(this.commentTableName)
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.commentTableName)
      .select("*", { count: "exact", head: true })
      .eq("article_id", articleId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Creates a new comment on an article.
   * @returns The created comment.
   * @throws {DatabaseError} If the database operation fails.
   */
  createComment = async (dto: commentInsert): RepositoryResult<commentRow> => {
    const { data, error } = await supabase
      .from(this.commentTableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Deletes a comment.
   * @returns The deleted comment.
   * @throws {DatabaseError} If the database operation fails.
   */
  deleteComment = async (commentId: string): RepositoryResult<commentRow> => {
    const { data, error } = await supabase
      .from(this.commentTableName)
      .delete()
      .eq("id", commentId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };
}

export const articleRepositoryInstance = new ArticleRepository();
