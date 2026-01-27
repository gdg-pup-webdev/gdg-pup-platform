/**
 * Shared fixtures for publicationSystem tests.
 *
 * These values mirror the typed contract so controller tests can validate
 * response shapes without hitting a real database.
 */
export const publicationPagination = {
  pageNumber: 1,
  pageSize: 10,
} as const;

export const articleFixture = {
  id: "article-1",
  title: "Nexus Release Notes",
  body: "Highlights from the latest platform update.",
  author_id: "user-1",
  is_published: true,
  published_at: "2026-01-01T00:00:00.000Z",
  related_event_id: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} as const;

export const articleCommentFixture = {
  id: "comment-1",
  article_id: articleFixture.id,
  user_id: "user-1",
  body: "Great update!",
  created_at: "2026-01-01T01:00:00.000Z",
  updated_at: "2026-01-01T01:00:00.000Z",
} as const;

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
