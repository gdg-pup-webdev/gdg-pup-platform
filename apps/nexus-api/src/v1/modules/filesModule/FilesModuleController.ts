import { FileBuffer } from "./domain/FileBuffer";
import { FileRecord, FileRecordUpdateProps } from "./domain/FileRecord";
import { FolderInsertProps, FolderUpdateProps } from "./domain/Folder";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { DeleteFileByPreviewUrl } from "./useCases/DeleteFileByPreviewUrl";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { ListFilesByFolderWithPagination } from "./useCases/ListFilesByFolderWithPagination";
import { ListFilesByPathWithPagination } from "./useCases/ListFilesByPathWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";
import { CreateFolder } from "./useCases/CreateFolder";
import { ListFoldersByParent } from "./useCases/ListFoldersByParent";
import { GetOneFolderById } from "./useCases/GetOneFolderById";
import { DeleteFolderById } from "./useCases/DeleteFolderById";

export class FilesModuleController {
  constructor(
    private deleteFileByIdUseCase: DeleteFileById,
    private getOneFileByIdUseCase: GetOneFileById,
    private listFIlesWithPaginationUseCase: ListFIlesWithPagination,
    private listFilesByFolderWithPaginationUseCase: ListFilesByFolderWithPagination,
    private listFilesByPathWithPaginationUseCase: ListFilesByPathWithPagination,
    private updateFileByIdUseCase: UpdateFileById,
    private uploadFileUseCase: UploadFile,
    private deleteFileByPreviewUrlUseCase: DeleteFileByPreviewUrl,
    private createFolderUseCase: CreateFolder,
    private listFoldersByParentUseCase: ListFoldersByParent,
    private getOneFolderByIdUseCase: GetOneFolderById,
    private deleteFolderByIdUseCase: DeleteFolderById,
  ) {}

  private toFileResponse(file: FileRecord) {
    return {
      id: file.props.id,
      fileName: file.props.fileName,
      fileDescription: file.props.fileDescription,
      folderId: file.props.folderId,
      fileType: file.props.fileType,
      createdAt: file.props.createdAt,
      updatedAt: file.props.updatedAt,
      previewUrl: file.props.previewUrl,
      previewUrl64: file.props.previewUrl64,
      previewUrl128: file.props.previewUrl128,
      previewUrl256: file.props.previewUrl256,
      previewUrl512: file.props.previewUrl512,
      downloadUrl: file.props.previewUrl,
      deletedAt: file.props.deletedAt,
      storageReference: file.props.storageReference,
      storageRef64: file.props.storageRef64,
      storageRef128: file.props.storageRef128,
      storageRef256: file.props.storageRef256,
      storageRef512: file.props.storageRef512,
    };
  }

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

    return this.toFileResponse(result);
  }

  async listFilesWithPagination(page: number, pageSize: number) {
    const result = await this.listFIlesWithPaginationUseCase.execute(
      page,
      pageSize,
    );

    return {
      list: result.list.map((f) => this.toFileResponse(f)),
      count: result.count,
    };
  }

  async listFilesByFolderWithPagination(page: number, pageSize: number, folderId: string | null) {
    const result = await this.listFilesByFolderWithPaginationUseCase.execute(
      page,
      pageSize,
      folderId,
    );

    return {
      list: result.list.map((f) => this.toFileResponse(f)),
      count: result.count,
    };
  }

  async listFilesByPathWithPagination(page: number, pageSize: number, path: string) {
    const result = await this.listFilesByPathWithPaginationUseCase.execute(
      page,
      pageSize,
      path,
    );

    return {
      list: result.list.map((f) => this.toFileResponse(f)),
      count: result.count,
    };
  }

  async updateFileById(id: string, updateDTO: FileRecordUpdateProps) {
    const result = await this.updateFileByIdUseCase.execute(id, updateDTO);

    return this.toFileResponse(result);
  }

  async uploadFile(
    arrayBuffer: ArrayBuffer,
    type: string,
    name: string,
    description: string,
    folderId: string | null,
    path?: string,
  ) {
    const fileBufferObject = new FileBuffer(arrayBuffer, name, type);

    const result = await this.uploadFileUseCase.execute(
      fileBufferObject,
      name,
      description,
      folderId,
      path,
    );

    return this.toFileResponse(result);
  }

  // Folder methods
  async createFolder(props: FolderInsertProps) {
    const result = await this.createFolderUseCase.execute(props);
    return result.props;
  }

  async listFoldersByParent(page: number, pageSize: number, parentId: string | null) {
    const result = await this.listFoldersByParentUseCase.execute(page, pageSize, parentId);
    return {
      list: result.list.map(f => f.props),
      count: result.count
    };
  }

  async getOneFolderById(id: string) {
    const result = await this.getOneFolderByIdUseCase.execute(id);
    return result.props;
  }

  async deleteFolderById(id: string) {
    const result = await this.deleteFolderByIdUseCase.execute(id);
    return result;
  }
}
