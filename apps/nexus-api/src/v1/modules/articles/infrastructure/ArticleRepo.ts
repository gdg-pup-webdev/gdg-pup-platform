import { IArticleRepo } from "../domain/IArticleRepo";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";
import { Article } from "../domain/Article";

export class ArticleRepository implements IArticleRepo {
  private mapToDomain(row: Tables<"article">): Article {
    return Article.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || null,
      content: row.content || "",
      imageUrl: row.thumbnail_url || undefined,
      authorId: row.author_id || "",
      eventId: row.eventId || null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      published_at: row.published_at ? new Date(row.published_at) : null,
      is_published: row.is_published || false,
    });
  }

  private mapToRow(article: Article): TablesInsert<"article"> {
    return {
      id: article.props.id,
      title: article.props.title,
      description: article.props.description,
      content: article.props.content,
      thumbnail_url: article.props.imageUrl || null,
      author_id: article.props.authorId,
      eventId: article.props.eventId,
      created_at: article.props.createdAt.toISOString(),
      updated_at: article.props.updatedAt.toISOString(),
      published_at: article.props.published_at?.toISOString() || null,
      is_published: article.props.is_published,
    };
  }

  async saveNew(article: Article): Promise<Article> {
    const { data, error } = await supabase
      .from("article")
      .insert(this.mapToRow(article))
      .select()
      .single();

    if (error) handlePostgresError(error);
    if (!data) throw new Error("Failed to create article");
    return this.mapToDomain(data);
  }

  async persistUpdates(article: Article): Promise<Article> {
    console.log("updating" , article);
    // {
    //     author_id?: string | null;
    //     content?: string | null;
    //     created_at?: string;
    //     description?: string | null;
    //     eventId?: string | null;
    //     id?: string;
    //     is_published?: boolean;
    //     published_at?: string | null;
    //     thumbnail_url?: string | null;
    //     title?: string;
    //     updated_at?: string;
    // }

    const { data, error } = await supabase
      .from("article")
      .update({
        author_id: article.props.authorId,
        content: article.props.content,
        created_at: article.props.createdAt.toISOString(),
        description: article.props.description,
        eventId: article.props.eventId,
        id: article.props.id,
        is_published: article.props.is_published,
        published_at: article.props.published_at?.toISOString() || null,
        thumbnail_url: article.props.imageUrl || null,
        title: article.props.title,
        updated_at: article.props.updatedAt.toISOString(),
      } as TablesUpdate<"article">)
      .eq("id", article.props.id)
      .select()
      .single();

    if (error) handlePostgresError(error);
    if (!data) throw new Error("Failed to update article");
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("article").delete().eq("id", id);
    if (error) handlePostgresError(error);
  }

  async findById(id: string): Promise<Article | undefined> {
    const { data, error } = await supabase
      .from("article")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error) handlePostgresError(error);
    return data ? this.mapToDomain(data) : undefined;
  }

  async list(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: Article[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from("article").select("*", { count: "exact" });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }
}
