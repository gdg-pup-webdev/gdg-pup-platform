import { describe, expect, it, beforeEach } from "vitest";
import { MockFileRepository } from "../infrastructure/MockFileRepository";
import { MockFileStorage } from "../infrastructure/MockFileStorage";
import { DeleteFileById } from "../useCases/DeleteFileById";
import { UploadFile } from "../useCases/UploadFile";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { GetOneFileById } from "../useCases/GetOneFileById";
import { ListFIlesWithPagination } from "../useCases/ListFIlesWithPagination";

let fileRepository: IFileRepository;
let fileStorage: IFileStorage;
let uploadFileUseCase: UploadFile;
let deleteFileByIdUseCase: DeleteFileById;
let getOneFileByIdUseCase: GetOneFileById;
let listFIlesWithPagination: ListFIlesWithPagination;

const initializeInstances = () => {
  fileRepository = new MockFileRepository();
  fileStorage = new MockFileStorage();
  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);
  deleteFileByIdUseCase = new DeleteFileById(fileRepository, fileStorage);
  getOneFileByIdUseCase = new GetOneFileById(fileRepository);
  listFIlesWithPagination = new ListFIlesWithPagination(fileRepository);
};

describe("listFIlesWithPagination", () => {
  beforeEach(initializeInstances);

  it("returns list of files", async () => {
    const upload10Files = async () => {
      for (let i = 0; i < 10; i++) {
        const fileBuffer = new FileBuffer(
          new ArrayBuffer(0),
          `filename${i}`,
          `filetype${i}`,
        );
        await uploadFileUseCase.execute(
          fileBuffer,
          `filename${i}`,
          `filedescription${i}`,
          `file/path${i}`,
        );
      }
    };

    await upload10Files();

    const result = await listFIlesWithPagination.execute(1, 10);

    for (let i = 0; i < 10; i++) {
      expect(result.list[i].props.fileName).toBe(`filename${i}`);
      expect(result.list[i].props.fileDescription).toBe(`filedescription${i}`);
      expect(result.list[i].props.filePath).toBe(`file/path${i}`);
    }
  });

  it("page size works", async () => {
    const upload10Files = async () => {
      for (let i = 0; i < 10; i++) {
        const fileBuffer = new FileBuffer(
          new ArrayBuffer(0),
          `filename${i}`,
          `filetype${i}`,
        );
        await uploadFileUseCase.execute(
          fileBuffer,
          `filename${i}`,
          `filedescription${i}`,
          `file/path${i}`,
        );
      }
    };

    await upload10Files();
    const result = await listFIlesWithPagination.execute(1, 3);

    expect(result.list.length).toBe(3);
  });

  it("page number works", async () => {
    const upload10Files = async () => {
      for (let i = 0; i < 10; i++) {
        const fileBuffer = new FileBuffer(
          new ArrayBuffer(0),
          `filename${i}`,
          `filetype${i}`,
        );
        await uploadFileUseCase.execute(
          fileBuffer,
          `filename${i}`,
          `filedescription${i}`,
          `file/path${i}`,
        );
      }
    };

    await upload10Files();

    const result = await listFIlesWithPagination.execute(2, 3);

    expect(result.list.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(result.list[i].props.fileName).toBe(`filename${i + 3}`);
      expect(result.list[i].props.fileDescription).toBe(
        `filedescription${i + 3}`,
      );
      expect(result.list[i].props.filePath).toBe(`file/path${i + 3}`);
    }
  });
});
