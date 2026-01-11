import { EventModels } from "./event.model.js";
import { AttendanceModels } from "./attendance.model.js";
import { AttendeeModels } from "./attendee.model.js";
import { CheckinModels } from "./checkin.model.js";

export namespace EventSystemModels {
  export import event = EventModels;
  export import attendance = AttendanceModels;
  export import attendee = AttendeeModels;
  export import checkin = CheckinModels;
}
