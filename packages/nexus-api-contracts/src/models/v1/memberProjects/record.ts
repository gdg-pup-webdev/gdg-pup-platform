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
  mainImageUrl: cz.string().nullable(),
  secondaryImageUrl: cz.string().nullable(),
  tertiaryImageUrl: cz.string().nullable(),
  memberGdgId: cz.string(),

  // Included details
  member: cz.object({
    gdgId: cz.string(),
    name: cz.string().nullable(),
    email: cz.string().nullable(),
    imageUrl: cz.string().nullable(),
  }).nullable() ,
});

/** Data Transfer Object for creating a new member project. */
export const memberProjectsRecordInsertDTO = memberProjectsRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  mainImageUrl: true,
  secondaryImageUrl: true,
  tertiaryImageUrl: true,
  member: true,
});

/** Data Transfer Object for updating an existing member project. */
export const memberProjectsRecordUpdateDTO = memberProjectsRecordInsertDTO.partial();
