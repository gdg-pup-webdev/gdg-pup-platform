export type RepositoryResult<T> = Promise<T>;

export type RespositoryResultList<T> = Promise<{
  list: T[];
  count: number;
}>;
