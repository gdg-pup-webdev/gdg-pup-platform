import { describe, expect, it, beforeEach } from "vitest";
import { MockFileRepository } from "../infrastructure/MockFileRepository";
import { MockFileStorage } from "../infrastructure/MockFileStorage";
import { UpdateFileById } from "../useCases/UpdateFileById";
import { UploadFile } from "../useCases/UploadFile";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";

let fileRepository: IFileRepository;
let fileStorage: IFileStorage;
let uploadFileUseCase: UploadFile;
let updateFileByIdUseCase: UpdateFileById;

const initializeInstances = () => {
  fileRepository = new MockFileRepository();
  fileStorage = new MockFileStorage();
  uploadFileUseCase = new UploadFile(fileStorage, fileRepository);
  updateFileByIdUseCase = new UpdateFileById(fileRepository);
};

describe("UpdateFileById Use Case", () => {
  beforeEach(initializeInstances);

  it("successfully updates file metadata", async () => {
    // 1. Upload a file first
    const fileBuffer = new FileBuffer(
      new ArrayBuffer(0),
      "old-name.png",
      "image/png",
    );
    const uploadedFile = await uploadFileUseCase.execute(
      fileBuffer,
      "Original Name",
      "Original Description",
      "path/to/file",
    );

    // 2. Update it
    const updateProps = {
      fileName: "Updated Name",
      fileDescription: "Updated Description",
    };

    const result = await updateFileByIdUseCase.execute(
      uploadedFile.props.id,
      updateProps,
    );

    // 3. Assertions
    expect(result.props.fileName).toBe("Updated Name");
    expect(result.props.fileDescription).toBe("Updated Description");
    // Ensure ID remains the same
    expect(result.props.id).toBe(uploadedFile.props.id);
  });

  it("throws an error if attempting to update a non-existent file", async () => {
    const call = () =>
      updateFileByIdUseCase.execute("non-existent-id", { fileName: "New" });
    await expect(call).rejects.toThrow("File not found");
  });
});
