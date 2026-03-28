import { cz } from "@packages/typed-rest/shared";

export const LearningResourceModel = cz.object({
  id: cz.string().uuid(),
  title: cz.string(),
  description: cz.string(),
  url: cz.string(),
  tags: cz.array(cz.string()),
  teamId: cz.string().uuid().nullable(),
  eventId: cz.string().uuid().nullable(),
  thumbnailUrl: cz.string().nullable(),
  createdAt: cz.date(),
  updatedAt: cz.date(),
  // Included details
  team: cz.object({
    id: cz.string().uuid(),
    name: cz.string(),
    description: cz.string(),
  }).nullable().optional(),
  event: cz.object({
    id: cz.string().uuid(),
    title: cz.string(),
    description: cz.string().nullable(),
    imageUrl: cz.string().nullable(),
    startDate: cz.date().nullable(),
    endDate: cz.date().nullable(),
    venue: cz.string().nullable(),
  }).nullable().optional(),
});

export const LearningResourceInsertModel = LearningResourceModel.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  thumbnailUrl: true,
  team: true,
  event: true,
});

export const LearningResourceUpdateModel = LearningResourceInsertModel.partial();

export type LearningResource = cz.infer<typeof LearningResourceModel>;
export type LearningResourceInsert = cz.infer<typeof LearningResourceInsertModel>;
export type LearningResourceUpdate = cz.infer<typeof LearningResourceUpdateModel>;
