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
      folder_id: props.folderId,
      preview_url: props.previewUrl,
      preview_url_64: props.previewUrl64,
      preview_url_128: props.previewUrl128,
      preview_url_256: props.previewUrl256,
      preview_url_512: props.previewUrl512,
      storage_ref: props.storageReference,
      storage_ref_64: props.storageRef64,
      storage_ref_128: props.storageRef128,
      storage_ref_256: props.storageRef256,
      storage_ref_512: props.storageRef512,
      file_type: props.fileType,
      is_deleted: false,
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
      ...(props.folderId !== undefined && { folder_id: props.folderId }),
      ...(props.previewUrl !== undefined && { preview_url: props.previewUrl }),
      ...(props.previewUrl64 !== undefined && { preview_url_64: props.previewUrl64 }),
      ...(props.previewUrl128 !== undefined && {
        preview_url_128: props.previewUrl128,
      }),
      ...(props.previewUrl256 !== undefined && {
        preview_url_256: props.previewUrl256,
      }),
      ...(props.previewUrl512 !== undefined && {
        preview_url_512: props.previewUrl512,
      }),
      ...(props.storageReference !== undefined && {
        storage_ref: props.storageReference,
      }),
      ...(props.storageRef64 !== undefined && { storage_ref_64: props.storageRef64 }),
      ...(props.storageRef128 !== undefined && {
        storage_ref_128: props.storageRef128,
      }),
      ...(props.storageRef256 !== undefined && {
        storage_ref_256: props.storageRef256,
      }),
      ...(props.storageRef512 !== undefined && {
        storage_ref_512: props.storageRef512,
      }),
      ...(props.fileType !== undefined && { file_type: props.fileType }),
      ...(props.id !== undefined && { id: props.id }),
      ...(props.createdAt !== undefined && { created_at: props.createdAt }),
      ...(props.updatedAt !== undefined && { updated_at: props.updatedAt }),
      ...(props.isDeleted !== undefined && { is_deleted: props.isDeleted }),
      ...(props.deletedAt !== undefined && { deleted_at: props.deletedAt }),
    };
  }

  // 3. Mapper for data coming out of the DB
  private toDomainRecord(row: any): FileRow {
    const previewUrl1024 =
      row.preview_url ||
      row.preview_url_512 ||
      row.preview_url_256 ||
      row.preview_url_128 ||
      row.preview_url_64;
    const storageRef1024 =
      row.storage_ref ||
      row.storage_ref_512 ||
      row.storage_ref_256 ||
      row.storage_ref_128 ||
      row.storage_ref_64;

    if (!previewUrl1024 || !storageRef1024) {
      throw new Error(`File record ${row.id} is missing base preview/storage references.`);
    }

    const previewUrl512 = row.preview_url_512 || previewUrl1024;
    const previewUrl256 = row.preview_url_256 || previewUrl512;
    const previewUrl128 = row.preview_url_128 || previewUrl256;
    const previewUrl64 = row.preview_url_64 || previewUrl128;

    const storageRef512 = row.storage_ref_512 || storageRef1024;
    const storageRef256 = row.storage_ref_256 || storageRef512;
    const storageRef128 = row.storage_ref_128 || storageRef256;
    const storageRef64 = row.storage_ref_64 || storageRef128;

    return {
      id: row.id,
      fileName: row.file_name,
      fileDescription: row.file_description,
      folderId: row.folder_id,
      previewUrl: previewUrl1024,
      previewUrl64,
      previewUrl128,
      previewUrl256,
      previewUrl512,
      storageReference: storageRef1024,
      storageRef64,
      storageRef128,
      storageRef256,
      storageRef512,
      fileType: row.file_type || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isDeleted: Boolean(row.is_deleted),
      deletedAt: row.deleted_at,
    };
  }

  private toHydratedRecord(row: any): FileRecord | null {
    const domainRecord = this.toDomainRecord(row);
    if (domainRecord.isDeleted) {
      return null;
    }
    return FileRecord.hydrate(domainRecord);
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
    return data ? this.toHydratedRecord(data) : null;
  }

  async findByPreviewUrl(previewUrl: string): Promise<FileRecord | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("preview_url", previewUrl)
      .maybeSingle();

    if (error) throw new Error(`Failed to find file by URL: ${error.message}`);
    return data ? this.toHydratedRecord(data) : null;
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

    if (file.props.isDeleted) {
      return file;
    }

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
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to list files: ${error.message}`);

    return {
      list: (data || [])
        .map((row) => this.toHydratedRecord(row))
        .filter((record): record is FileRecord => record !== null),
      count: count || 0,
    };
  }

  async listByFolderPaginated(
    page: number,
    pageSize: number,
    folderId: string | null,
  ): Promise<{ list: FileRecord[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .eq("is_deleted", false);

    if (folderId === null) {
      query = query.is("folder_id", null);
    } else {
      query = query.eq("folder_id", folderId);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error)
      throw new Error(`Failed to list files by folder: ${error.message}`);

    return {
      list: (data || [])
        .map((row) => this.toHydratedRecord(row))
        .filter((record): record is FileRecord => record !== null),
      count: count || 0,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update(
        this.toDbUpdate({
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      )
      .eq("is_deleted", false)
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete file record: ${error.message}`);
    return true;
  }
}
