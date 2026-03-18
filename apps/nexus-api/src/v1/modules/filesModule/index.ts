import { FilesModuleController } from "./FilesModuleController";
import { SupabaseFileRepository } from "./infrastructure/SupabaseFileRepository";
import { SupabaseFileStorage } from "./infrastructure/SupabaseFileStorage";
import { SupabaseFolderRepository } from "./infrastructure/SupabaseFolderRepository";
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

/**
 * infrastructure dependencies
 */
const fileRepository = new SupabaseFileRepository();
const folderRepository = new SupabaseFolderRepository();
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
const listFilesByFolderWithPaginationUseCase: ListFilesByFolderWithPagination =
  new ListFilesByFolderWithPagination(fileRepository);
const listFilesByPathWithPaginationUseCase: ListFilesByPathWithPagination =
  new ListFilesByPathWithPagination(fileRepository, folderRepository);
const updateFileByIdUseCase: UpdateFileById = new UpdateFileById(
  fileRepository,
);
const uploadFileUseCase: UploadFile = new UploadFile(
  fileStorage,
  fileRepository,
  folderRepository,
);
const deleteFileByPreviewUrlUseCase: DeleteFileByPreviewUrl =
  new DeleteFileByPreviewUrl(fileRepository, fileStorage);

const createFolderUseCase = new CreateFolder(folderRepository);
const listFoldersByParentUseCase = new ListFoldersByParent(folderRepository);
const getOneFolderByIdUseCase = new GetOneFolderById(folderRepository);
const deleteFolderByIdUseCase = new DeleteFolderById(
  folderRepository,
  fileRepository,
  fileStorage,
);

/**
 * exporting default controller
 */
export const filesModuleController = new FilesModuleController(
  deleteFileByIdUseCase,
  getOneFileByIdUseCase,
  listFIlesWithPaginationUseCase,
  listFilesByFolderWithPaginationUseCase,
  listFilesByPathWithPaginationUseCase,
  updateFileByIdUseCase,
  uploadFileUseCase,
  deleteFileByPreviewUrlUseCase,
  createFolderUseCase,
  listFoldersByParentUseCase,
  getOneFolderByIdUseCase,
  deleteFolderByIdUseCase,
);

export * from "./FilesModuleController";
