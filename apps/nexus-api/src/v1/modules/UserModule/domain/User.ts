export type UserProps = {
  id: string;
  email: string;
  username: string;
  roleId: string;
  createdAt: Date;
};

export class User {
  _props: UserProps;

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