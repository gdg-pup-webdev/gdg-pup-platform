import { randomUUID } from "node:crypto";

export type UserProps = {
  id: string;
  username: string;
  emailAddress: string;
  passwordHash: string;
  otpCode: string | null;
  otpExpiresAt: Date | null;
};

export class User {
  private _props: UserProps;

  private constructor(props: UserProps) {
    this._props = props;
  }

  static create(props: Omit<UserProps, "id" | "otpCode" | "otpExpiresAt">): User {
    if (!props.emailAddress.includes("@")) {
      throw new Error("Invalid email address.");
    }
    if (!props.username.trim()) {
      throw new Error("Username is required.");
    }
    return new User({
      ...props,
      id: randomUUID(),
      otpCode: null,
      otpExpiresAt: null,
    });
  }

  static hydrate(props: UserProps): User {
    return new User(props);
  }

  get props(): UserProps {
    return { ...this._props };
  }

  updatePassword(newHash: string): void {
    this._props.passwordHash = newHash;
    this.clearOtp();
  }

  updateEmail(newEmail: string): void {
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email address.");
    }
    this._props.emailAddress = newEmail;
    this.clearOtp();
  }

  updateUsername(newUsername: string): void {
    if (!newUsername.trim()) {
      throw new Error("Username cannot be empty.");
    }
    this._props.username = newUsername;
  }

  setOtp(code: string, expiresAt: Date): void {
    this._props.otpCode = code;
    this._props.otpExpiresAt = expiresAt;
  }

  clearOtp(): void {
    this._props.otpCode = null;
    this._props.otpExpiresAt = null;
  }

  isOtpValid(code: string): boolean {
    if (!this._props.otpCode || !this._props.otpExpiresAt) return false;
    if (this._props.otpCode !== code) return false;
    return new Date() < this._props.otpExpiresAt;
  }
}
