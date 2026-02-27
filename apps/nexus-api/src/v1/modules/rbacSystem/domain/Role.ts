export type RoleProps = {
  id: string;
  name: string;
  description: string;
  permissions: {
    resource: string;
    action: string;
  }[];
};

export type RoleInsertProps = Omit<RoleProps, "id" | "permissions">;

export type RoleUpdateProps = Partial<RoleInsertProps>;

export class Role {
  _props: RoleProps;
  constructor(props: RoleProps) {
    this._props = props;
  }

  static create = (props: RoleInsertProps) => {
    return new Role({
      ...props,
      permissions: [],
      id: crypto.randomUUID(),
    });
  };

  static hydrate = (props: RoleProps) => {
    return new Role(props);
  };

  get props() {
    return this._props;
  }

  update = (props: RoleUpdateProps) => {
    this._props = { ...this._props, ...props };
  };

  attachPermission = (resource: string, action: string) => {
    this._props.permissions.push({
      resource,
      action,
    });
  };

  detachPermission = (resource: string, action: string) => {
    this._props.permissions = this._props.permissions.filter((permission) => {
      return !(
        permission.resource === resource && permission.action === action
      );
    });
  };
}
