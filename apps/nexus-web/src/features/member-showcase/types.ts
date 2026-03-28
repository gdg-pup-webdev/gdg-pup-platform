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

export interface MemberShowcase {
  id: string;
  thumbnailUrl: string;
  title: string;
  date: string;
  description: string;
  articleUrl: string;
  showcasedMembers: ShowcasedMember[];
  createdAt: string;
}

export interface CreateMemberShowcaseDTO {
  title: string;
  date: string;
  description: string;
  articleUrl: string;
  showcasedMembers: string[]; // Array of GDG IDs
}

export interface UpdateMemberShowcaseDTO extends Partial<CreateMemberShowcaseDTO> {}
