export type Permission = {
  resource: string;
  action: string;
  from_role: string;
};

export type MemberInfo = {
  gdgId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  avatarUrl: string | null;
  program: string | null;
  yearLevel: number | null;
  department: string | null;
};

export type TokenPayload = {
  email: string;
  validUntil: string;
  memberInfo: MemberInfo;
  permissions: Permission[];
};