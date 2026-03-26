export type UserProps = { 
  gdgId: string; 
  memberName: string | null; 
    thumbnailImageUrl: string | null;
};


export class User {
  private _props: UserProps;

  constructor(props: UserProps) {
    this._props = props;
  }
 
  static hydrate(props: UserProps): User {
    return new User(props);
  }

  get props(): UserProps {
    return this._props;
  }
 
}