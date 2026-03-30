import { cz } from "@packages/typed-rest/shared";

/** Represents a member project record as stored in the database. */
export const memberProjectsRecord = cz.object({
  id: cz.string().uuid(),
  createdAt: cz.string().datetime(),
  updatedAt: cz.string().datetime(),
  title: cz.string(),
  startDate: cz.string().datetime(),
  endDate: cz.string().datetime().nullable(),
  description: cz.string(),
  mainImageUrl: cz.string().nullable(),
  secondaryImageUrl: cz.string().nullable(),
  tertiaryImageUrl: cz.string().nullable(),
  memberGdgId: cz.string(),
});

/** Data Transfer Object for creating a new member project. */
export const memberProjectsRecordInsertDTO = memberProjectsRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/** Data Transfer Object for updating an existing member project. */
export const memberProjectsRecordUpdateDTO = memberProjectsRecordInsertDTO.partial();
