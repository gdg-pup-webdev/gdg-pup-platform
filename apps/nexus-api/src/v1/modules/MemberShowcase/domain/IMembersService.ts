export interface ShowcasedMember {
  gdgId: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string | null;
  program: string | null;
  yearLevel: number | null;
}

export interface IMembersService {
  findByIds(ids: string[]): Promise<ShowcasedMember[]>;
  exists(id: string): Promise<boolean>;
}
