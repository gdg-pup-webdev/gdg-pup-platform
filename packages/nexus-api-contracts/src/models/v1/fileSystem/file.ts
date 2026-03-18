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
  fileType: true,
}).extend({
  // path is optional and can be used to navigate through folders to upload
  path: cz.string().optional(),
});

export const fileRecordUpdateDTO = fileRecordInsertDTO.partial();
