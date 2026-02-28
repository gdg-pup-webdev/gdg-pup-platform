import { cz } from "@packages/typed-rest/shared";

export const fileRecord = cz.object({
  fileName: cz.string(),
  fileDescription: cz.string(),
  filePath: cz.string(),

  // metadata
  id: cz.string(),
  createdAt: cz.string(),
  updatedAt: cz.string(),
  deletedAt: cz.string(),

  // access data
  storageReference: cz.string(),
  previewUrl: cz.string(),
  downloadUrl: cz.string(),
});

export const fileRecordInsertDTO = fileRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  storageReference: true,
  previewUrl: true,
  downloadUrl: true,
});

export const fileRecordUpdateDTO = fileRecordInsertDTO.partial();
