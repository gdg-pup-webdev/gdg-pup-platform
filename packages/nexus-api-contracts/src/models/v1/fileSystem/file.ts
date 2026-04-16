import { cz } from "@packages/typed-rest/shared";

export const fileRecord = cz.object({
  fileName: cz.string(),
  fileDescription: cz.string(),
  folderId: cz.string().uuid().nullable(),
  fileType: cz.string(),

  // metadata
  id: cz.string(),
  createdAt: cz.string(),
  updatedAt: cz.string(),
  deletedAt: cz.string().nullable(),

  // access data
  storageReference: cz.string(),
  storageRef64: cz.string(),
  storageRef128: cz.string(),
  storageRef256: cz.string(),
  storageRef512: cz.string(),
  previewUrl: cz.string(),
  previewUrl64: cz.string(),
  previewUrl128: cz.string(),
  previewUrl256: cz.string(),
  previewUrl512: cz.string(),
  downloadUrl: cz.string(),
});

export const fileRecordInsertDTO = fileRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  storageReference: true,
  storageRef64: true,
  storageRef128: true,
  storageRef256: true,
  storageRef512: true,
  previewUrl: true,
  previewUrl64: true,
  previewUrl128: true,
  previewUrl256: true,
  previewUrl512: true,
  downloadUrl: true,
  fileType: true,
}).extend({
  // path is optional and can be used to navigate through folders to upload
  path: cz.string().optional(),
});

export const fileRecordUpdateDTO = fileRecordInsertDTO.partial();
