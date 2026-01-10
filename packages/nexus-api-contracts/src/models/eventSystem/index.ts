import { EventModels } from "./event.model.js";
import { AttendanceModels } from "./attendance.model.js";

export namespace EventSystemModels {
  export import event = EventModels;
  export import attendance = AttendanceModels;
}
