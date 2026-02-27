import { cz } from "@packages/typed-rest/shared";

export const projectRow = cz.object({
  // metadata
  id: cz.string(),
  created_at: cz.string(),
  owner_id: cz.string(),

  // props
  title: cz.string(),
  preview_image_url: cz.string(),
  demo_url: cz.string().nullable(),
  description: cz.string(),
  repo_url: cz.string().nullable(),
  tech_stack: cz.string(),
});

export const projectInsertDTO = projectRow.omit({
  id: true,
  created_at: true,
  owner_id: true,
  preview_image_url: true,
});

export const projectUpdateDTO = projectInsertDTO.partial();
