import { describe, expect, it,beforeEach} from "vitest";
import { MockFileRepository } from "../infrastructure/MockFileRepository";
import { MockFileStorage } from "../infrastructure/MockFileStorage";
import { DeleteFileById } from "../useCases/DeleteFileById";
import { UploadFile } from "../useCases/UploadFile";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage"; 

let fileRepository: IFileRepository;
let fileStorage: IFileStorage;
let uploadFileUseCase: UploadFile;
let deleteFileByIdUseCase: DeleteFileById;

const initializeInstances = () => {
  fileRepository = new MockFileRepository();
  fileStorage = new MockFileStorage();
  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);
  deleteFileByIdUseCase = new DeleteFileById(fileRepository, fileStorage);
};

describe("deleteFileByIdUseCase", () => {
  beforeEach(initializeInstances);

  it("returns true if file is deleted", async () => {
    const fileBuffer = new FileBuffer(
      new ArrayBuffer(0),
      "filename",
      "filetype",
    );
    const sampleFileToDelete = await uploadFileUseCase.execute(
      fileBuffer,
      "filename",
      "filedescription",
      "file/path",
    );
    const result = await deleteFileByIdUseCase.execute(
      sampleFileToDelete.props.id,
    );

    expect(result).toBe(true);
  });

  it("returns true if file is not found but no other errors occured", async () => {
    const result = await deleteFileByIdUseCase.execute(
      "id of file that doesnt exist",
    );

    expect(result).toBe(true);
  });
});
