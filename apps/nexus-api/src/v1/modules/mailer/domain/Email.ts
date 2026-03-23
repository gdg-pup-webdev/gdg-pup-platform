export type EmailProps = {
  to: string;
  subject: string;
  message: string;
  sentAt?: Date;
};

export class Email {
  private _props: EmailProps;

  private constructor(props: EmailProps) {
    this._props = props;
  }

  static create(props: EmailProps): Email {
    if (!props.to.includes("@")) {
      throw new Error("Invalid receiver email address.");
    }
    if (!props.subject.trim()) {
      throw new Error("Subject is required.");
    }
    if (!props.message.trim()) {
      throw new Error("Message is required.");
    }
    return new Email(props);
  }

  static hydrate(props: EmailProps): Email {
    return new Email(props);
  }

  get props(): EmailProps {
    return { ...this._props };
  }

  markAsSent(): void {
    this._props.sentAt = new Date();
  }
}
