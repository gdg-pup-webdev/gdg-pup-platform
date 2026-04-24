export type Permission = {
  resource: string;
  action: string;
  from_role: string;
};

export type MemberInfo = {
  email: string;
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

export type TokenPayloadProps = {
  email: string;
  validUntil: string;
  loginTime: string;
  memberInfo: MemberInfo;
  permissions: Permission[];
  roles: string[];
};

export class TokenPayload {
  private _props: TokenPayloadProps;

  private constructor(props: TokenPayloadProps) {
    this._props = props;
  }

  static create(props: TokenPayloadProps): TokenPayload {
    return new TokenPayload({
      ...props,
    });
  }

  static hydrate(props: TokenPayloadProps): TokenPayload {
    return new TokenPayload(props);
  }

  get props(): TokenPayloadProps {
    return { ...this._props };
  }
}
