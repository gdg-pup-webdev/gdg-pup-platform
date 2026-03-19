import { User } from "./User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  paginatedList(pageNumber: number, pageSize: number): Promise<{ list: User[]; count: number }>;
  search(query: string, limit: number): Promise<User[]>;
}
