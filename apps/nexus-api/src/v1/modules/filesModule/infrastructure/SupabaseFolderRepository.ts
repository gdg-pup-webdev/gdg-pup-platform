import { supabase } from "@/v1/lib/supabase";
import { Folder, FolderProps } from "../domain/Folder";
import { IFolderRepository } from "../domain/IFolderRepository";

export class SupabaseFolderRepository implements IFolderRepository {
  private readonly TABLE_NAME = "filesystem_folder";

  private toDb(folder: Folder) {
    return {
      name: folder.props.name,
      description: folder.props.description,
      parent_id: folder.props.parentId,
      updated_at: folder.props.updatedAt,
    };
  }

  private toDomain(row: any): Folder {
    return Folder.hydrate({
      id: row.id,
      name: row.name,
      description: row.description,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async save(folder: Folder): Promise<Folder> {
    const dbPayload = this.toDb(folder);

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .upsert({
        id: folder.props.id,
        ...dbPayload,
        created_at: folder.props.createdAt,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save folder: ${error.message}`);
    return this.toDomain(data);
  }

  async findById(id: string): Promise<Folder | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Failed to find folder: ${error.message}`);
    return data ? this.toDomain(data) : null;
  }

  async findByNameAndParent(
    name: string,
    parentId: string | null,
  ): Promise<Folder | null> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("name", name);

    if (parentId === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", parentId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw new Error(`Failed to find folder by name: ${error.message}`);
    return data ? this.toDomain(data) : null;
  }

  async listByParentPaginated(
    page: number,
    pageSize: number,
    parentId: string | null,
  ): Promise<{ list: Folder[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" });

    if (parentId === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", parentId);
    }

    const { data, error, count } = await query
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw new Error(`Failed to list folders: ${error.message}`);

    return {
      list: (data || []).map((row) => this.toDomain(row)),
      count: count || 0,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete folder: ${error.message}`);
    return true;
  }
}
