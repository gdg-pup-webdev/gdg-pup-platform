import { cz } from "@packages/typed-rest/shared";

export const folder = cz.object({
  id: cz.string().uuid(),
  name: cz.string(),
  description: cz.string().optional(),
  parentId: cz.string().uuid().nullable(),
  createdAt: cz.string(),
  updatedAt: cz.string(),
});

export const folderInsertDTO = folder.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const folderUpdateDTO = folderInsertDTO.partial();
