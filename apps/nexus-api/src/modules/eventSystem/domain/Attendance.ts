export type AttendanceProps = {
  userId: string;
  eventId: string;
  checkInMethod: string;
  checkedInAt: Date;
};

export class Attendance {
  _props: AttendanceProps;

  constructor(props: AttendanceProps) {
    this._props = props;
  }

  static hydrate(props: AttendanceProps) {
    return new Attendance(props);
  }

  get props() {
    return this._props;
  }
}
