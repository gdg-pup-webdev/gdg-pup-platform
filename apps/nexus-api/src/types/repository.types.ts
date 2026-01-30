export type RepositoryResult<T> = Promise<T>;

export type RepositoryResultList<T> = Promise<{
  list: T[];
  count: number;
}>;
