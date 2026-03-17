export type UserProps = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  avatarUrl: string | null;
  gdgId: string | null;
  roleId: string;
  createdAt: Date;
};

export class User {
  private _props: UserProps;

  constructor(props: UserProps) {
    this._props = props;
  }

  static hydrate = (props: UserProps) => {
    return new User(props);
  };

  get props() {
    return this._props;
  }
}
