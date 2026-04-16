import { cz } from "@packages/typed-rest/shared";

export const ProfileViewRecord = cz.object({
  id: cz.string().uuid(),
  viewerGdgId: cz.string().nullable(),
  profileGdgId: cz.string(),
  date: cz.string().datetime(),
  user_agent: cz.string(),
  source: cz.string(),
});

export const ProfileViewRecordInsertDTO = ProfileViewRecord.omit({
  id: true,
  date: true,
});

export const ProfileAnalyticsRecord = cz.object({
  date: cz.string().datetime(),
  totalViews: cz.number(),
  latestViews: cz.object({
    views: cz.array(ProfileViewRecord),
    pageNumber: cz.number(),
    pageSize: cz.number(),
    totalViews: cz.number(),
    totalPages: cz.number(),
  }),
});
