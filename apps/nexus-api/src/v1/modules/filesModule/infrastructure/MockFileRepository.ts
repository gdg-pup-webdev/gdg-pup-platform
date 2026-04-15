import { FileRecord, FileRecordPrototype } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class MockFileRepository implements IFileRepository {
  public list: FileRecord[] = [];
  public count = 0;

  async findByPreviewUrl(previewUrl: string): Promise<FileRecord | null> {
    const found = this.list.find(
      (f) => f.props.previewUrl === previewUrl && !f.props.isDeleted,
    );
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
      isDeleted: false,
      deletedAt: null,
    });

    this.list.push(record);
    this.count = this.list.length;

    return record;
  }

  async findById(id: string): Promise<FileRecord | null> {
    const found = this.list.find((f) => f.props.id === id && !f.props.isDeleted);
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
      list: this.list.filter((f) => !f.props.isDeleted).slice(start, end),
      count: this.list.filter((f) => !f.props.isDeleted).length,
    };
  }

  async listByFolderPaginated(
    page: number,
    pageSize: number,
    folderId: string | null,
  ): Promise<{ list: FileRecord[]; count: number }> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const filteredList = this.list.filter(
      (f) => f.props.folderId === folderId && !f.props.isDeleted,
    );

    return {
      list: filteredList.slice(start, end),
      count: filteredList.length,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const record = this.list.find((f) => f.props.id === id);
    if (!record || record.props.isDeleted) {
      return false;
    }

    record.markAsDeleted();
    await this.saveUpdates(record);

    return true;
  }
}
