import { cz } from "@packages/typed-rest/shared";

export const LearningResourceModel = cz.object({
  id: cz.string().uuid(),
  title: cz.string(),
  description: cz.string(),
  url: cz.string(),
  type: cz.enum(["studyJam", "external", "blog"]),
  tags: cz.array(cz.string()),
  teamId: cz.string().uuid().nullable(),
  eventId: cz.string().uuid().nullable(),
  thumbnailUrl: cz.string().nullable(),
  createdAt: cz.date(),
  updatedAt: cz.date(),
});

export const LearningResourceInsertModel = LearningResourceModel.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const LearningResourceUpdateModel = LearningResourceInsertModel.partial();

export type LearningResource = cz.infer<typeof LearningResourceModel>;
export type LearningResourceInsert = cz.infer<typeof LearningResourceInsertModel>;
export type LearningResourceUpdate = cz.infer<typeof LearningResourceUpdateModel>;
