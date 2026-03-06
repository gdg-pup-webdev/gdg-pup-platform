import { cz } from "@packages/typed-rest/shared";

export const studyJamRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  uploader_id: cz.string(),

  title: cz.string(),
  team: cz.string(),
  description: cz.string(),
  image_url: cz.string(),
  recording_url: cz.string(),
  summary: cz.string(),
});

export const studyJamInsertDTO = studyJamRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const studyJamUpdateDTO = studyJamInsertDTO.partial();
