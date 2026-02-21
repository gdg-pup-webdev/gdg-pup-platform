import { FileRecord  } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class GetOneFileById {
  constructor(private fileRepository: IFileRepository) {}

  async execute(fileId: string): Promise<FileRecord> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new Error("File not found");
    }

    return file;
  }
}
