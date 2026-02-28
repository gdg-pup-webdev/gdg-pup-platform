import { FilesModuleController } from "./FilesModuleController";
import { MockFileRepository } from "./infrastructure/MockFileRepository";
import { MockFileStorage } from "./infrastructure/MockFileStorage";
import { SupabaseFileRepository } from "./infrastructure/SupabaseFileRepository";
import { SupabaseFileStorage } from "./infrastructure/SupabaseFileStorage";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { DeleteFileByPreviewUrl } from "./useCases/DeleteFileByPreviewUrl";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";

/**
 * infrastructure dependencies
 */
const fileRepository = new SupabaseFileRepository();
const fileStorage = new SupabaseFileStorage();

/**
 * use cases
 */
const deleteFileByIdUseCase: DeleteFileById = new DeleteFileById(
  fileRepository,
  fileStorage,
);
const getOneFileByIdUseCase: GetOneFileById = new GetOneFileById(
  fileRepository,
);
const listFIlesWithPaginationUseCase: ListFIlesWithPagination =
  new ListFIlesWithPagination(fileRepository);
const updateFileByIdUseCase: UpdateFileById = new UpdateFileById(
  fileRepository,
);
const uploadFileUseCase: UploadFile = new UploadFile(
  fileStorage,
  fileRepository,
);
const deleteFileByPreviewUrlUseCase: DeleteFileByPreviewUrl =
  new DeleteFileByPreviewUrl(fileRepository, fileStorage);

/**
 * exporting default controller
 */
export const filesModuleController = new FilesModuleController(
  deleteFileByIdUseCase,
  getOneFileByIdUseCase,
  listFIlesWithPaginationUseCase,
  updateFileByIdUseCase,
  uploadFileUseCase,
  deleteFileByPreviewUrlUseCase,
);
export * from "./FilesModuleController";
