import { Team } from "./Team";

export interface ITeamRepository {
  findById(id: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  findAll(pageNumber: number, pageSize: number): Promise<{ list: Team[]; count: number }>;
  search(query: string, limit: number): Promise<Team[]>;
  saveNew(team: Team): Promise<Team>;
  persistUpdates(team: Team): Promise<Team>;
  delete(id: string): Promise<void>;
}