import { FileBuffer } from "./domain/FileBuffer";
import { FileRecord, FileRecordUpdateProps } from "./domain/FileRecord";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";

export class FileSystemController {
  constructor(
    private deleteFileByIdUseCase: DeleteFileById,
    private getOneFileByIdUseCase: GetOneFileById,
    private listFIlesWithPaginationUseCase: ListFIlesWithPagination,
    private updateFileByIdUseCase: UpdateFileById,
    private uploadFileUseCase: UploadFile,
  ) {}

  async deleteFileById<T = boolean>(
    id: string,
    presenter: (f: boolean) => T,
  ): Promise<T> {
    const result = await this.deleteFileByIdUseCase.execute(id);
    return presenter(result);
  }

  async getOneFileById<T = FileRecord>(
    id: string,
    presenter: (f: FileRecord) => T,
  ): Promise<T> {
    const result = await this.getOneFileByIdUseCase.execute(id);
    return presenter(result);
  }

  async listFIlesWithPagination<T = { list: FileRecord[]; count: number }>(
    page: number,
    pageSize: number,
    presenter: (f: { list: FileRecord[]; count: number }) => T,
  ): Promise<T> {
    const result = await this.listFIlesWithPaginationUseCase.execute(
      page,
      pageSize,
    );
    return presenter(result);
  }

  async updateFileById<T = FileRecord>(
    id: string,
    updateDTO: FileRecordUpdateProps,
    presenter: (f: FileRecord) => T,
  ): Promise<T> {
    const result = await this.updateFileByIdUseCase.execute(id, updateDTO);
    return presenter(result);
  }

  async uploadFile<T = FileRecord>(
    file: FileBuffer,
    name: string,
    description: string,
    path: string,
    presenter: (f: FileRecord) => T,
  ): Promise<T> {
    const result = await this.uploadFileUseCase.execute(
      file,
      name,
      description,
      path,
    );
    return presenter(result);
  }
}
