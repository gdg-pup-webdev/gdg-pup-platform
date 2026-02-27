import { FileRecord, FileRecordPrototype } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class MockFileRepository implements IFileRepository {
  public list: FileRecord[] = [];
  public count = 0;

  async findByPreviewUrl(previewUrl: string): Promise<FileRecord | null> {
    const found = this.list.find((f) => f.props.previewUrl === previewUrl);
    return found || null;
  }

  async savePrototype(file: FileRecordPrototype): Promise<FileRecord> {
    const now = new Date().toISOString();

    // Create the metadata and hydrate the record
    const record = FileRecord.hydrate({
      ...file.props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: "", // Assuming empty string for non-deleted
    });

    this.list.push(record);
    this.count = this.list.length;

    return record;
  }

  async findById(id: string): Promise<FileRecord | null> {
    const found = this.list.find((f) => f.props.id === id);
    return found || null;
  }

  async saveUpdates(file: FileRecord): Promise<FileRecord> {
    const index = this.list.findIndex((f) => f.props.id === file.props.id);

    if (index === -1) {
      throw new Error(`FileRecord with id ${file.props.id} not found.`);
    }

    // Update the timestamp
    file.props.updatedAt = new Date().toISOString();

    this.list[index] = file;
    return file;
  }

  async listPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ list: FileRecord[]; count: number }> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      list: this.list.slice(start, end),
      count: this.list.length,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const initialLength = this.list.length;
    this.list = this.list.filter((f) => f.props.id !== id);
    this.count = this.list.length;

    return this.list.length < initialLength;
  }
}
