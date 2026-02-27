import { FileBuffer } from "./domain/FileBuffer";
import { FileRecordUpdateProps } from "./domain/FileRecord";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { DeleteFileByPreviewUrl } from "./useCases/DeleteFileByPreviewUrl";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";

export class FilesModuleController {
  constructor(
    private deleteFileByIdUseCase: DeleteFileById,
    private getOneFileByIdUseCase: GetOneFileById,
    private listFIlesWithPaginationUseCase: ListFIlesWithPagination,
    private updateFileByIdUseCase: UpdateFileById,
    private uploadFileUseCase: UploadFile,
    private deleteFileByPreviewUrlUseCase: DeleteFileByPreviewUrl,
  ) {}

  async deleteFileByPreviewUrl(publicUrl: string) {
    const result = await this.deleteFileByPreviewUrlUseCase.execute(publicUrl);

    return result;
  }


  async deleteFileById(id: string) {
    const result = await this.deleteFileByIdUseCase.execute(id);

    return result;
  }

  async getOneFileById(id: string) {
    const result = await this.getOneFileByIdUseCase.execute(id);

    const convertedResult = {
      id: result.props.id,
      name: result.props.fileName,
      description: result.props.fileDescription,
      path: result.props.filePath,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };

    return convertedResult;
  }

  async listFIlesWithPagination(page: number, pageSize: number) {
    const result = await this.listFIlesWithPaginationUseCase.execute(
      page,
      pageSize,
    );

    const convertedResult = {
      list: result.list.map((f) => ({
        id: f.props.id,
        name: f.props.fileName,
        description: f.props.fileDescription,
        path: f.props.filePath,
        createdAt: f.props.createdAt,
        updatedAt: f.props.updatedAt,
        previewUrl: f.props.previewUrl,
        downloadUrl: f.props.previewUrl,
        deletedAt: f.props.deletedAt,
        storageReference: f.props.storageReference,
      })),
      count: result.count,
    };
    return convertedResult;
  }

  async updateFileById(id: string, updateDTO: FileRecordUpdateProps) {
    const result = await this.updateFileByIdUseCase.execute(id, updateDTO);

    const convertedResult = {
      id: result.props.id,
      name: result.props.fileName,
      description: result.props.fileDescription,
      path: result.props.filePath,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };

    return convertedResult;
  }

  async uploadFile(
    arrayBuffer: ArrayBuffer,
    type: string,
    name: string,
    description: string,
    path: string,
  ) {
    const fileBufferObject = new FileBuffer(arrayBuffer, name, type);

    const result = await this.uploadFileUseCase.execute(
      fileBufferObject,
      name,
      description,
      path,
    );

    const convertedResult = {
      id: result.props.id,
      name: result.props.fileName,
      description: result.props.fileDescription,
      path: result.props.filePath,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };

    return convertedResult;
  }
}
