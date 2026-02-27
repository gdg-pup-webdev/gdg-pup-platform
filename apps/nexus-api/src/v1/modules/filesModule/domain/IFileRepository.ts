import { FileRecord, FileRecordPrototype } from "./FileRecord";

export abstract class IFileRepository {
  constructor() {}

  abstract savePrototype(file: FileRecordPrototype): Promise<FileRecord>;

  abstract findById(id: string): Promise<FileRecord | null>;
  abstract findByPreviewUrl(previewUrl: string): Promise<FileRecord | null>; 

  abstract saveUpdates(file: FileRecord): Promise<FileRecord>;

  abstract listPaginated(
    page: number,
    pageSize: number,
  ): Promise<{
    list: FileRecord[];
    count: number;
  }>;

  abstract deleteById(id: string): Promise<boolean>;
}
