import { describe, expect, it, beforeEach } from "vitest";
import { MockFileRepository } from "../infrastructure/MockFileRepository";
import { MockFileStorage } from "../infrastructure/MockFileStorage";
import { DeleteFileById } from "../useCases/DeleteFileById";
import { UploadFile } from "../useCases/UploadFile";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { GetOneFileById } from "../useCases/GetOneFileById";

let fileRepository: IFileRepository;
let fileStorage: IFileStorage;
let uploadFileUseCase: UploadFile;
let deleteFileByIdUseCase: DeleteFileById;
let getOneFileByIdUseCase: GetOneFileById;

const initializeInstances = () => {
  fileRepository = new MockFileRepository();
  fileStorage = new MockFileStorage();
  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);
  deleteFileByIdUseCase = new DeleteFileById(fileRepository, fileStorage);
  getOneFileByIdUseCase = new GetOneFileById(fileRepository);
};

describe("getOneFileByIdUseCase", () => {
  beforeEach(initializeInstances);

  it("returns a file if it exists", async () => {
    const fileBuffer = new FileBuffer(
      new ArrayBuffer(0),
      "filename",
      "filetype",
    );
    const exampleUploadedFile = await uploadFileUseCase.execute(
      fileBuffer,
      "filename",
      "filedescription",
      "file/path",
    );

    const result = await getOneFileByIdUseCase.execute(
      exampleUploadedFile.props.id,
    );

    expect(result.props.id).toBe(exampleUploadedFile.props.id);
    expect(result.props.fileName).toBe(exampleUploadedFile.props.fileName);
    expect(result.props.fileDescription).toBe(
      exampleUploadedFile.props.fileDescription,
    );
  });

  it("throws an error if file doesnt exist", async () => {
    const call = async () =>
      await getOneFileByIdUseCase.execute("id of file that doesnt exist");

    await expect(call).rejects.toThrow();
  });
});
