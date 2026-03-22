import { randomUUID } from "node:crypto";

export type OneTimePinProps = {
  reference: string;
  email: string;
  otpCode: string;
  expiresAt: Date;
  isUsed: boolean;
};

export class OneTimePin {
  private _props: OneTimePinProps;

  private constructor(props: OneTimePinProps) {
    this._props = props;
  }

  static create(props: Omit<OneTimePinProps, "reference" | "isUsed">): OneTimePin {
    if (!props.email.includes("@")) throw new Error("Invalid email.");
    if (props.otpCode.length < 6) throw new Error("OTP must be at least 6 characters.");
    
    return new OneTimePin({
      ...props,
      reference: randomUUID(),
      isUsed: false,
    });
  }

  static hydrate(props: OneTimePinProps): OneTimePin {
    return new OneTimePin(props);
  }

  get props(): OneTimePinProps {
    return { ...this._props };
  }

  verify(otp: string): boolean {
    if (this._props.isUsed) return false;
    if (new Date() > this._props.expiresAt) return false;
    return this._props.otpCode === otp;
  }

  use(): void {
    if (this._props.isUsed) throw new Error("OTP already used.");
    if (new Date() > this._props.expiresAt) throw new Error("OTP expired.");
    this._props.isUsed = true;
  }
}
