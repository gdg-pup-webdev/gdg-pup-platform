import { DatabaseError } from "@/errors/HttpError";
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
type commentUpdate = TablesUpdate<"article_comment">;

export class ArticleRepository {
  tableName = "article";
  commentTableName = "article_comment";

  constructor() {}

  create = async (dto: TablesInsert<"article">): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
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

  getOne = async (articleId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

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

  createComment = async (dto: commentInsert): RepositoryResult<commentRow> => {
    const { data, error } = await supabase
      .from(this.commentTableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

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
