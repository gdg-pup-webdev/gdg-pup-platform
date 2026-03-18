import { FileBuffer } from "./domain/FileBuffer";
import { FileRecordUpdateProps } from "./domain/FileRecord";
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

    return {
      id: result.props.id,
      fileName: result.props.fileName,
      fileDescription: result.props.fileDescription,
      folderId: result.props.folderId,
      fileType: result.props.fileType,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };
  }

  async listFilesWithPagination(page: number, pageSize: number) {
    const result = await this.listFIlesWithPaginationUseCase.execute(
      page,
      pageSize,
    );

    return {
      list: result.list.map((f) => ({
        id: f.props.id,
        fileName: f.props.fileName,
        fileDescription: f.props.fileDescription,
        folderId: f.props.folderId,
        fileType: f.props.fileType,
        createdAt: f.props.createdAt,
        updatedAt: f.props.updatedAt,
        previewUrl: f.props.previewUrl,
        downloadUrl: f.props.previewUrl,
        deletedAt: f.props.deletedAt,
        storageReference: f.props.storageReference,
      })),
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
      list: result.list.map((f) => ({
        id: f.props.id,
        fileName: f.props.fileName,
        fileDescription: f.props.fileDescription,
        folderId: f.props.folderId,
        fileType: f.props.fileType,
        createdAt: f.props.createdAt,
        updatedAt: f.props.updatedAt,
        previewUrl: f.props.previewUrl,
        downloadUrl: f.props.previewUrl,
        deletedAt: f.props.deletedAt,
        storageReference: f.props.storageReference,
      })),
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
      list: result.list.map((f) => ({
        id: f.props.id,
        fileName: f.props.fileName,
        fileDescription: f.props.fileDescription,
        folderId: f.props.folderId,
        fileType: f.props.fileType,
        createdAt: f.props.createdAt,
        updatedAt: f.props.updatedAt,
        previewUrl: f.props.previewUrl,
        downloadUrl: f.props.previewUrl,
        deletedAt: f.props.deletedAt,
        storageReference: f.props.storageReference,
      })),
      count: result.count,
    };
  }

  async updateFileById(id: string, updateDTO: FileRecordUpdateProps) {
    const result = await this.updateFileByIdUseCase.execute(id, updateDTO);

    return {
      id: result.props.id,
      fileName: result.props.fileName,
      fileDescription: result.props.fileDescription,
      folderId: result.props.folderId,
      fileType: result.props.fileType,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };
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

    return {
      id: result.props.id,
      fileName: result.props.fileName,
      fileDescription: result.props.fileDescription,
      folderId: result.props.folderId,
      fileType: result.props.fileType,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
      previewUrl: result.props.previewUrl,
      downloadUrl: result.props.previewUrl,
      deletedAt: result.props.deletedAt,
      storageReference: result.props.storageReference,
    };
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
}
