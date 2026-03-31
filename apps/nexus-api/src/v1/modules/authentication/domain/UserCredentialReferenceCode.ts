export enum ReferenceCodeType {
  CREATE_USER = "CREATE_USER",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  CHANGE_EMAIL = "CHANGE_EMAIL",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export type UserCredentialReferenceCodeProps = {
  referenceCode: string;
  emailAddress: string;
  payload: Record<string, any>;
  type: ReferenceCodeType;
  otpReference: string;
  createdAt?: Date;
};

export class UserCredentialReferenceCode {
  private _props: UserCredentialReferenceCodeProps;

  private constructor(props: UserCredentialReferenceCodeProps) {
    this._props = props;
  }

  static create(props: Omit<UserCredentialReferenceCodeProps, "referenceCode" | "createdAt">): UserCredentialReferenceCode {
    return new UserCredentialReferenceCode({
      ...props,
      referenceCode: crypto.randomUUID(),
    });
  }

  static hydrate(props: UserCredentialReferenceCodeProps): UserCredentialReferenceCode {
    return new UserCredentialReferenceCode(props);
  }

  get props(): UserCredentialReferenceCodeProps {
    return { ...this._props };
  }

  updateOtpReference(newReference: string): void {
    this._props.otpReference = newReference;
  }
}

