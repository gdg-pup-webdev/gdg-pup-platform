export type ProfileViewerProps = {
  id: string;
  viewerGdgId: string | null;
  profileGdgId: string;
  date: string;
  user_agent: string;
  source: string;
};

export type ProfileViewerInsertProps = Omit<ProfileViewerProps, "id" | "date">;

export class ProfileViewer {
  private _props: ProfileViewerProps;

  get props() {
    return this._props;
  }

  private constructor(props: ProfileViewerProps) {
    this._props = props;
  }

  static create(props: ProfileViewerInsertProps) {
    return new ProfileViewer({
      ...props,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    });
  }

  static hydrate(props: ProfileViewerProps) {
    return new ProfileViewer(props);
  }
}
