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

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
