import { Team, TeamProps } from "../domain/Team";
import { TeamMember, TeamMemberProps } from "../domain/TeamMember";

export const buildTeamProps = (
  overrides: Partial<TeamProps> = {},
): TeamProps => ({
  id: overrides.id ?? "team-1",
  name: overrides.name ?? "Core Team",
  description: overrides.description ?? "Leads the chapter initiatives.",
  responsibilities:
    overrides.responsibilities ?? "Owns planning and execution.",
  parentTeamId: overrides.parentTeamId ?? null,
});

export const buildTeamMemberProps = (
  overrides: Partial<TeamMemberProps> = {},
): TeamMemberProps => ({
  id: overrides.id ?? "member-1",
  teamId: overrides.teamId ?? "team-1",
  gdgId: overrides.gdgId ?? "user-1",
  role: overrides.role ?? "Lead",
  joinedAt: overrides.joinedAt ?? new Date("2026-03-16T00:00:00.000Z"),
  teamName: overrides.teamName ?? "Alex Doe",
  thumbnailImageUrl: overrides.thumbnailImageUrl ?? "https://example.com/avatar.png",
});

export const buildTeam = (overrides: Partial<TeamProps> = {}): Team =>
  Team.hydrate(buildTeamProps(overrides));

export const buildTeamMember = (
  overrides: Partial<TeamMemberProps> = {},
): TeamMember => TeamMember.hydrate(buildTeamMemberProps(overrides));
