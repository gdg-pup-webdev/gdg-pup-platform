import { ITeamRepository } from "../domain/ITeamRepository";
import { ITeamMemberRepository, TeamMemberFilters } from "../domain/ITeamMemberRepository";
import { IUserRepository } from "../domain/IUserRepository";
import { Team } from "../domain/Team";
import { TeamMember } from "../domain/TeamMember";

export class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];
  async findById(id: string) { return this.teams.find(t => t.props.id === id) || null; }
  async findByName(name: string) { return this.teams.find(t => t.props.name.toLowerCase() === name.toLowerCase()) || null; }
  async findAll(p: number, s: number) { return { list: this.teams.slice((p-1)*s, p*s), count: this.teams.length }; }
  async search(query: string, limit: number) {
    const searchTerm = query.toLowerCase();
    return this.teams
      .filter(t => t.props.name.toLowerCase().includes(searchTerm) || t.props.description.toLowerCase().includes(searchTerm))
      .slice(0, limit);
  }
  async saveNew(t: Team) { this.teams.push(t); return t; }
  async persistUpdates(t: Team) { const i = this.teams.findIndex(x => x.props.id === t.props.id); this.teams[i] = t; return t; }
  async delete(id: string) { this.teams = this.teams.filter(t => t.props.id !== id); }
}

export class MockTeamMemberRepository implements ITeamMemberRepository {
  public members: TeamMember[] = [];
  async findById(id: string) { return this.members.find(m => m.props.id === id) || null; }
  async findAllWithFilters(p: number, s: number, f: TeamMemberFilters) {
    let res = this.members;
    if (f.teamId) res = res.filter(m => m.props.teamId === f.teamId);
    if (f.userId) res = res.filter(m => m.props.gdgId === f.userId);
    if (f.role) res = res.filter(m => m.props.role === f.role);
    return { list: res.slice((p-1)*s, p*s), count: res.length };
  }
  async saveNew(m: TeamMember) { this.members.push(m); return m; }
  async persistUpdates(m: TeamMember) { const i = this.members.findIndex(x => x.props.id === m.props.id); this.members[i] = m; return m; }
  async delete(id: string) { this.members = this.members.filter(m => m.props.id !== id); }
}

// Minimal mock to simulate the external user module
export class MockUserRepository implements IUserRepository {
  public users: { id: string }[] = [];
  async findById(id: string) { return this.users.find(u => u.id === id) || null; }
}