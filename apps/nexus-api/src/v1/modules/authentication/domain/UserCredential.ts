export type UserCredentialProps = {
  id: string;
  emailAddress: string;
  username: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserCredential {
  private _props: UserCredentialProps;

  private constructor(props: UserCredentialProps) {
    this._props = props;
  }

  static create(props: Omit<UserCredentialProps, "id" | "createdAt" | "updatedAt">): UserCredential {
    if (!props.emailAddress.includes("@")) {
      throw new Error("Invalid email address.");
    }
    return new UserCredential({
      ...props,
      id: crypto.randomUUID(),
    });
  }

  static hydrate(props: UserCredentialProps): UserCredential {
    return new UserCredential(props);
  }

  get props(): UserCredentialProps {
    return { ...this._props };
  }

  updatePassword(newHash: string): void {
    this._props.passwordHash = newHash;
    this._props.updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email address.");
    }
    this._props.emailAddress = newEmail;
    this._props.updatedAt = new Date();
  }

  updateUsername(newUsername: string): void {
    if (!newUsername.trim()) {
      throw new Error("Username cannot be empty.");
    }
    this._props.username = newUsername;
    this._props.updatedAt = new Date();
  }
}

