 
import { supabase } from "@/v1/lib/supabase";
import {
  FileRecord,
  FileRecordPrototype,
  FileRecordPrototypeProps,
  FileRecordMetadataProps,
} from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

// Helper type to represent the database row structure
type FileRow = FileRecordPrototypeProps & FileRecordMetadataProps;

export class SupabaseFileRepository implements IFileRepository {
  private readonly TABLE_NAME = "file_record";

  // --- Mappers to bridge snake_case (DB) and camelCase (Domain) ---

  // 1. Strict mapper for Inserts (satisfies Supabase's Insert type)
  private toDbInsert(props: FileRecordPrototypeProps) {
    return {
      file_name: props.fileName,
      file_description: props.fileDescription,
      file_path: props.filePath,
      preview_url: props.previewUrl,
      storage_ref: props.storageReference,
    };
  }

  // 2. Partial mapper for Updates (satisfies Supabase's Update type)
  private toDbUpdate(props: Partial<FileRow>) {
    return {
      // Using !== undefined to safely allow empty strings ("") to be updated
      ...(props.fileName !== undefined && { file_name: props.fileName }),
      ...(props.fileDescription !== undefined && {
        file_description: props.fileDescription,
      }),
      ...(props.filePath !== undefined && { file_path: props.filePath }),
      ...(props.previewUrl !== undefined && { preview_url: props.previewUrl }),
      ...(props.storageReference !== undefined && {
        storage_ref: props.storageReference,
      }),
      ...(props.id !== undefined && { id: props.id }),
      ...(props.createdAt !== undefined && { created_at: props.createdAt }),
      ...(props.updatedAt !== undefined && { updated_at: props.updatedAt }),
      ...(props.deletedAt !== undefined && { deleted_at: props.deletedAt }),
    };
  }

  // 3. Mapper for data coming out of the DB
  private toDomainRecord(row: any): FileRow {
    return {
      id: row.id,
      fileName: row.file_name,
      fileDescription: row.file_description,
      filePath: row.file_path,
      previewUrl: row.preview_url,
      storageReference: row.storage_ref,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  // --- Repository Methods ---

  async savePrototype(file: FileRecordPrototype): Promise<FileRecord> {
    // Use the strict insert mapper here
    const dbPayload = this.toDbInsert(file.props);

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw new Error(`Failed to save file record: ${error.message}`);
    return FileRecord.hydrate(this.toDomainRecord(data));
  }

  async findById(id: string): Promise<FileRecord | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Failed to find file: ${error.message}`);
    return data ? FileRecord.hydrate(this.toDomainRecord(data)) : null;
  }

  async findByPreviewUrl(previewUrl: string): Promise<FileRecord | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("preview_url", previewUrl)
      .maybeSingle();

    if (error) throw new Error(`Failed to find file by URL: ${error.message}`);
    return data ? FileRecord.hydrate(this.toDomainRecord(data)) : null;
  }

  async saveUpdates(file: FileRecord): Promise<FileRecord> {
    // Use the partial update mapper here
    const dbPayload = this.toDbUpdate(file.props);

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(dbPayload)
      .eq("id", file.props.id)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update file record: ${error.message}`);
    return FileRecord.hydrate(this.toDomainRecord(data));
  }

  async listPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ list: FileRecord[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to list files: ${error.message}`);

    return {
      list: (data || []).map((row) =>
        FileRecord.hydrate(this.toDomainRecord(row)),
      ),
      count: count || 0,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete file record: ${error.message}`);
    return true;
  }
}
