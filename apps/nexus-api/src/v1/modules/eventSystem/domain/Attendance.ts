export type AttendanceProps = {
  id: string;
  userId: string;
  eventId: string;
  checkInMethod: string;
  checkedInAt: Date;
};

export type AttendancePrototypeProps = Omit<
  AttendanceProps,
  "id" | "checkedInAt"
>;

export class Attendance {
  private constructor(private _props: AttendanceProps) {}

  static create(props: AttendancePrototypeProps) {
    return new Attendance({
      ...props,
      id: crypto.randomUUID(),
      checkedInAt: new Date(),
    });
  }

  static hydrate(props: AttendanceProps) {
    return new Attendance(props);
  }

  get props() {
    return this._props;
  }
}
