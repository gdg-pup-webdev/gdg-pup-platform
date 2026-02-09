/**
 * Represents the result of a repository operation that returns a single entity.
 */
export type RepositoryResult<T> = Promise<T>;

/**
 * Represents the result of a repository operation that returns a list of entities.
 */
export type RepositoryResultList<T> = Promise<{
  list: T[];
  count: number;
}>;
