export type CertificateProps = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  issuedAt: Date;
};

export type CertificateInsertProps = Omit<CertificateProps, "id" | "issuedAt">;

export type CertificateUpdateProps = Partial<Omit<CertificateProps, "id" | "userId" | "issuedAt">>;

export class Certificate {
  _props: CertificateProps;

  constructor(props: CertificateProps) {
    this._props = props;
  }

  static create = (props: CertificateInsertProps) => {
    return new Certificate({
      ...props,
      id: crypto.randomUUID(),
      issuedAt: new Date(),
    });
  };

  static hydrate = (props: CertificateProps) => {
    return new Certificate(props);
  };

  get props() {
    return this._props;
  }

  update = (props: CertificateUpdateProps) => {
    this._props = { ...this._props, ...props };
  };
}