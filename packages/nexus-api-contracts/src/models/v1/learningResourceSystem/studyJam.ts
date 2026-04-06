import { cz } from "@packages/typed-rest/shared";

export const studyJamRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string().nullable(),
  uploader_id: cz.string().nullable(),

  title: cz.string(),
  team_id: cz.string().nullable(),
  description: cz.string(),
  image_url: cz.string().nullable(),
  tags: cz.array(cz.string()).default([]),
  categories: cz.array(cz.string()).default([]),
  recording_url: cz.string().nullable(),
  summary: cz.string(),
});

export const studyJamInsertDTO = studyJamRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export const studyJamUpdateDTO = studyJamInsertDTO.partial();
