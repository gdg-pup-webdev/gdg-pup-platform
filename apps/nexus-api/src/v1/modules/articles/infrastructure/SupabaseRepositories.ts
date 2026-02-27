 import { IArticleRepository } from "../domain/IArticleRepository";
import { IArticleCommentRepository } from "../domain/IArticleCommentRepository";
import { Article } from "../domain/Article";
import { ArticleComment } from "../domain/ArticleComment";
import { supabase } from "@/v1/lib/supabase";

export class SupabaseArticleRepository implements IArticleRepository {
  private readonly tableName = "article";

  private mapToDomain(row: any): Article {
    return Article.hydrate({
      id: row.id,
      authorId: row.author_id,
      title: row.title,
      content: row.content,
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<Article | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(pageNumber: number, pageSize: number): Promise<{ list: Article[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);
    
    if (error) throw new Error(error.message);
    return { list: (data || []).map(this.mapToDomain), count: count || 0 };
  }

  async saveNew(article: Article): Promise<Article> {
    const props = article.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      author_id: props.authorId,
      title: props.title,
      content: props.content,
      created_at: props.createdAt.toISOString(),
    }).select().single();
    if (error) throw new Error(error.message);
    return this.mapToDomain(data);
  }

  async persistUpdates(article: Article): Promise<Article> {
    const props = article.props;
    const { data, error } = await supabase.from(this.tableName).update({
      title: props.title,
      content: props.content,
    }).eq("id", props.id).select().single();
    if (error) throw new Error(error.message);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export class SupabaseArticleCommentRepository implements IArticleCommentRepository {
  private readonly tableName = "article_comment";

  private mapToDomain(row: any): ArticleComment {
    return ArticleComment.hydrate({
      id: row.id,
      articleId: row.article_id,
      userId: row.user_id,
      body: row.body,
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<ArticleComment | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? this.mapToDomain(data) : null;
  }

  async findAllByArticleId(articleId: string): Promise<{ list: ArticleComment[]; count: number }> {
    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { list: (data || []).map(this.mapToDomain), count: count || 0 };
  }

  async saveNew(comment: ArticleComment): Promise<ArticleComment> {
    const props = comment.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      article_id: props.articleId,
      user_id: props.userId,
      body: props.body,
      created_at: props.createdAt.toISOString(),
    }).select().single();
    if (error) throw new Error(error.message);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}