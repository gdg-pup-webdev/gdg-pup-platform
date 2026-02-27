import { EventUpdateProps } from "./domain/Event";
import { CheckinToEvent } from "./useCases/CheckinToEvent";
import { CreateEvent } from "./useCases/CreateEvent";
import { DeleteEvent } from "./useCases/DeleteEvent";
import { GetOneEvent } from "./useCases/GetOneEvent";
import { ListEventAttendees } from "./useCases/ListEventAttendees";
import { ListEvents } from "./useCases/ListEvents";
import { UpdateEvent } from "./useCases/UpdateEvent";

export class EventSystemController {
  constructor(
    private checkinToEventUseCase: CheckinToEvent,
    private createEventUseCase: CreateEvent,
    private DeleteEventUseCase: DeleteEvent,
    private getOneEventUseCase: GetOneEvent,
    private listEventAttendeesUseCase: ListEventAttendees,
    private listEventsUseCase: ListEvents,
    private updateEventUseCase: UpdateEvent,
  ) {}

  async checkinToEvent(eventId: string, userId: string, checkInMethod: string) {
    const result = await this.checkinToEventUseCase.execute(
      eventId,
      userId,
      checkInMethod,
    );

    return {
      eventId: result.attendanceRecord.props.eventId,
      userId: result.attendanceRecord.props.userId,
      checkInMethod: result.attendanceRecord.props.checkInMethod,
      checkedInAt: result.attendanceRecord.props.checkedInAt.toISOString(),
      newUserPoints: result.newTotalPoints,
      eventAttendeeNumber: result.attendeeNumber,
    };
  }

  async createEvent(
    title: string,
    description: string,
    category: string,
    venue: string,
    start_date: string,
    end_date: string,
    attendance_points: number,
  ) {
    const result = await this.createEventUseCase.execute({
      title: title,
      description: description,
      category: category,
      venue: venue,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      attendance_points: attendance_points,
    });

    return {
      id: result.props.id,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
      title: result.props.title,
      description: result.props.description,
      category: result.props.category,
      venue: result.props.venue,
      start_date: result.props.start_date.toISOString(),
      end_date: result.props.end_date.toISOString(),
      attendance_points: result.props.attendance_points,
      attendees_count: result.props.attendees_count,
    };
  }

  async deleteEvent(eventId: string) {
    const result = await this.DeleteEventUseCase.execute(eventId);
    return result;
  }

  async getOneEvent(eventId: string) {
    const result = await this.getOneEventUseCase.execute(eventId);
    return {
      id: result.props.id,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
      title: result.props.title,
      description: result.props.description,
      category: result.props.category,
      venue: result.props.venue,
      start_date: result.props.start_date.toISOString(),
      end_date: result.props.end_date.toISOString(),
      attendance_points: result.props.attendance_points,
      attendees_count: result.props.attendees_count,
    };
  }

  async listEventAttendees(
    pageNumber: number,
    pageSize: number,
    eventId: string,
  ) {
    const result = await this.listEventAttendeesUseCase.execute(
      pageNumber,
      pageSize,
      eventId,
    );
    return {
      list: result.list.map((attendee) => ({
        userId: attendee.props.userId,
        eventId: attendee.props.eventId,
        checkInMethod: attendee.props.checkInMethod,
        checkedInAt: attendee.props.checkedInAt.toISOString(),
      })),
      count: result.count,
    };
  }

  async listEvents(pageNumber: number, pageSize: number) {
    const result = await this.listEventsUseCase.execute(pageNumber, pageSize);
    return {
      list: result.list.map((event) => ({
        id: event.props.id,
        createdAt: event.props.createdAt.toISOString(),
        updatedAt: event.props.updatedAt.toISOString(),
        title: event.props.title,
        description: event.props.description,
        category: event.props.category,
        venue: event.props.venue,
        start_date: event.props.start_date.toISOString(),
        end_date: event.props.end_date.toISOString(),
        attendance_points: event.props.attendance_points,
        attendees_count: event.props.attendees_count,
      })),
      count: result.count,
    };
  }

  async updateEvent(eventId: string, dto: EventUpdateProps) {
    const result = await this.updateEventUseCase.execute(eventId, dto);
    return {
      id: result.props.id,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
      title: result.props.title,
      description: result.props.description,
      category: result.props.category,
      venue: result.props.venue,
      start_date: result.props.start_date.toISOString(),
      end_date: result.props.end_date.toISOString(),
      attendance_points: result.props.attendance_points,
      attendees_count: result.props.attendees_count,
    };
  }
}
