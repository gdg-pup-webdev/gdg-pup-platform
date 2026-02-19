import { FileSystemController } from "./FileSystemController";
import { MockFileRepository } from "./infrastructure/MockFileRepository";
import { MockFileStorage } from "./infrastructure/MockFileStorage";
import { DeleteFileById } from "./useCases/DeleteFileById";
import { GetOneFileById } from "./useCases/GetOneFileById";
import { ListFIlesWithPagination } from "./useCases/ListFIlesWithPagination";
import { UpdateFileById } from "./useCases/UpdateFileById";
import { UploadFile } from "./useCases/UploadFile";

/**
 * infrastructure dependencies
 */
const fileRepository = new MockFileRepository();
const fileStorage = new MockFileStorage();

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

/**
 * controller
 */
export const fileSystemController = new FileSystemController(
  deleteFileByIdUseCase,
  getOneFileByIdUseCase,
  listFIlesWithPaginationUseCase,
  updateFileByIdUseCase,
  uploadFileUseCase,
);
export * from "./FileSystemController";
