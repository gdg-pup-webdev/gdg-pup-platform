import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts/models";
import { TablesInsert } from "@packages/nexus-api-contracts/types";

export class ArticleRepository {
  constructor() {}

  create = async (dto: TablesInsert<"article">) => {
    const { data, error } = await supabase
      .from("article")
      .insert(dto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.article.row };
  };

  list = async () => {
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.article.row[] };
  };

  getOne = async (articleId: string) => {
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.article.row };
  };

  update = async (
    articleId: string,
    dto: Models.articleSystem.article.updateDTO
  ) => {
    const { data, error } = await supabase
      .from("article")
      .update(dto)
      .eq("id", articleId)
      .select("*")
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.article.row };
  };

  delete = async (articleId: string) => {
    const { data, error } = await supabase
      .from("article")
      .delete()
      .eq("id", articleId)
      .select("*")
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.article.row };
  };

  listComments = async (articleId: string) => {
    const { data, error } = await supabase
      .from("article_comment")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.comment.row[] };
  };

  createComment = async (dto: Models.articleSystem.comment.insertDTO) => {
    const { data, error } = await supabase
      .from("article_comment")
      .insert(dto)
      .select("*")
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.comment.row };
  };

  deleteComment = async (commentId: string) => {
    const { data, error } = await supabase
      .from("article_comment")
      .delete()
      .eq("id", commentId)
      .select("*")
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.articleSystem.comment.row };
  };
}

export const articleRepositoryInstance = new ArticleRepository();
