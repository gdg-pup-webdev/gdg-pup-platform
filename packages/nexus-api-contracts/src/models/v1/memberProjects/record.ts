import { cz } from "@packages/typed-rest/shared";

/** Represents a member project record as stored in the database. */
export const memberProjectsRecord = cz.object({
  id: cz.string().uuid(),
  createdAt: cz.string(),
  updatedAt: cz.string(),
  title: cz.string(),
  startDate: cz.string(),
  endDate: cz.string().nullable(),
  description: cz.string(),
  projectLink: cz.string().nullable().optional(),
  images: cz.array(cz.string()).max(4),
  memberGdgId: cz.string(),

  // Included details
  member: cz
    .object({
      gdgId: cz.string(),
      name: cz.string().nullable(),
      email: cz.string().nullable(),
      imageUrl: cz.string().nullable(),
    })
    .nullable(),
});

/** Data Transfer Object for creating a new member project. */
export const memberProjectsRecordInsertDTO = memberProjectsRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  member: true,
  images: true, 
})

/** Data Transfer Object for updating an existing member project. */
export const memberProjectsRecordUpdateDTO =
  memberProjectsRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  member: true, 
}).partial();
