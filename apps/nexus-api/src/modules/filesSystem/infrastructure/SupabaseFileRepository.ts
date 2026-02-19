import { FileRecord, FileRecordPrototype } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class SupabaseFileRepository implements IFileRepository {
  list: FileRecord[] = [];
  count = 0;
  savePrototype(file: FileRecordPrototype): Promise<FileRecord> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<FileRecord | null> {
    throw new Error("Method not implemented.");
  }
  saveUpdates(file: FileRecord): Promise<FileRecord> {
    throw new Error("Method not implemented.");
  }
  listPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ list: FileRecord[]; count: number }> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
