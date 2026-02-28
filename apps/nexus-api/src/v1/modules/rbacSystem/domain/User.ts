import { Role } from "./Role";

export type UserProps = {
  id: string;
  roles: string[];
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

  attachRole = (role: Role) => {
    this._props.roles.push(role.props.name);
  };

  detachRole = (roleName: string) => {
    this._props.roles = this._props.roles.filter((role) => {
      return role !== roleName;
    });
  };
}
