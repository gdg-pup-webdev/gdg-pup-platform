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
};

export type TokenPayloadProps = {
  email: string;
  validUntil: string;
  memberInfo: MemberInfo;
  permissions: Permission[];
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
