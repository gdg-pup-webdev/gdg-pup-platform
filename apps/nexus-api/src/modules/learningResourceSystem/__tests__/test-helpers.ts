/**
 * Shared fixtures for learningResourceSystem tests.
 *
 * These helpers keep test data consistent across controller, service,
 * and repository tests without coupling to production code paths.
 */
export const learningResourcePagination = {
  pageNumber: 1,
  pageSize: 10,
} as const;

export const externalResourceFilterQuery = {
  search: "performance",
  createdFrom: "2026-01-01T00:00:00.000Z",
  createdTo: "2026-01-31T23:59:59.999Z",
  uploaderId: "user-1",
  tagIds: "tag-1,tag-2",
} as const;

export const externalResourceFilters = {
  search: "performance",
  createdFrom: "2026-01-01T00:00:00.000Z",
  createdTo: "2026-01-31T23:59:59.999Z",
  uploaderId: "user-1",
  tagIds: ["tag-1", "tag-2"],
};

export const externalResourceFixture = {
  id: "external-1",
  title: "Intro to Web Performance",
  description: "Performance fundamentals",
  resource_url: "https://example.com/perf",
  uploader_id: "user-1",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} as const;

export const studyJamFixture = {
  id: "studyjam-1",
  title: "Study Jam: TypeScript",
  description: "Hands-on TypeScript session",
  created_at: "2026-01-02T00:00:00.000Z",
  recording_url: "https://example.com/recording",
  summary: "Covers types, narrowing, and inference.",
} as const;

export const studyJamFilterQuery = {
  search: "typescript",
  createdFrom: "2026-01-01T00:00:00.000Z",
  createdTo: "2026-01-31T23:59:59.999Z",
} as const;

export const studyJamFilters = {
  search: "typescript",
  createdFrom: "2026-01-01T00:00:00.000Z",
  createdTo: "2026-01-31T23:59:59.999Z",
};

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
