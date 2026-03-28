import { Event, EventUpdateProps } from "./domain/Event";
import { FileToUpload } from './domain/IFileStorage';
import { CheckinToEvent } from "./useCases/CheckinToEvent";
import { CreateEvent } from "./useCases/CreateEvent";
import { CreateEventFromBevyEventUseCase } from "./useCases/CreateEventFromBevyEvent";
import { DeleteEvent } from "./useCases/DeleteEvent";
import { GetOneEvent } from "./useCases/GetOneEvent";
import { ListEventAttendees } from "./useCases/ListEventAttendees";
import { ListEvents } from "./useCases/ListEvents";
import { ListEventsByYear } from "./useCases/listEventsByYear";
import { UpdateEvent } from "./useCases/UpdateEvent";
import { GetEventsByType } from "./useCases/GetEventsByType";
import { GetEventsByTeam } from "./useCases/GetEventsByTeam";

export class EventSystemController {
  constructor(
    private readonly checkinToEventUseCase: CheckinToEvent,
    private readonly createEventUseCase: CreateEvent,
    private readonly createEventFromBevyEventUseCase: CreateEventFromBevyEventUseCase,
    private readonly deleteEventUseCase: DeleteEvent,
    private readonly getOneEventUseCase: GetOneEvent,
    private readonly listEventAttendeesUseCase: ListEventAttendees,
    private readonly listEventsUseCase: ListEvents,
    private readonly updateEventUseCase: UpdateEvent,
    private readonly listEventsByYearUseCase: ListEventsByYear,
    private readonly getEventsByTypeUseCase: GetEventsByType,
    private readonly getEventsByTeamUseCase: GetEventsByTeam,
  ) {}

  private flattenEvent(event: Event) {
    return {
      id: event.props.id,
      createdAt: event.props.createdAt.toISOString(),
      updatedAt: event.props.updatedAt.toISOString(),
      creatorId: event.props.creatorId,
      title: event.props.title,
      description: event.props.description,
      category: event.props.category,
      venue: event.props.venue,
      start_date: event.props.start_date.toISOString(),
      end_date: event.props.end_date.toISOString(),
      attendance_points: event.props.attendance_points,
      attendees_count: event.props.attendees_count,
      bevy_event_id: event.props.bevy_event_id,
      bevyPreviewUrl: event.props.bevyPreviewUrl,
      image_url: event.props.image_url,
      tags: event.props.tags,
      max_capacity: event.props.max_capacity,
      short_description: event.props.short_description,
      // New props
      speakers: event.props.speakers,
      type: event.props.type,
      teamId: event.props.teamId,
    }
  }

  async listEventsByYear(pageNumber: number, pageSize: number, year: number) { 
    const result = await this.listEventsByYearUseCase.execute(pageNumber, pageSize, year);
    return {
      list: result.list.map(this.flattenEvent),
      count: result.count,
    };
  }

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

  async createEvent({
    creatorId,
    title,
    description,
    category,
    venue,
    start_date,
    end_date,
    attendance_points,
    beviPreviewUrl,
    image,
    tags, 
    max_capacity,
    short_description,
    // New props
    speakers,
    type,
    teamId,
  }: {
    creatorId: string;
    title: string;
    description: string;
    category: string;
    venue: string;
    start_date: string;
    end_date: string;
    attendance_points: number;
    beviPreviewUrl?: string;
    image : File | null;
    tags?: string[];
    max_capacity?: number;
    short_description?: string;
    // New props
    speakers?: string[];
    type?: string;
    teamId?: string;
  }) {
    const result = await this.createEventUseCase.execute(
      {
        creatorId: creatorId,
        title: title,
        description: description,
        category: category,
        venue: venue,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        attendance_points: attendance_points,
        bevy_event_id: null,
        bevyPreviewUrl: beviPreviewUrl || null,
        tags: tags || [],
        max_capacity: max_capacity || 99999999,
        short_description: short_description || null,
        // New props
        speakers: speakers || [],
        type: type || null,
        teamId: teamId || null,
      },
      image? new FileToUpload({
        buffer: await image.arrayBuffer()  ,
        name: image.name  ,
        type: image.type  ,
      }) : null,  
    );

    return this.flattenEvent(result);
  }

  async createEventFromBevyEvent(bevyEventId: string, creatorId: string) {
    const result = await this.createEventFromBevyEventUseCase.execute(
      bevyEventId,
      creatorId,
    );

    return this.flattenEvent(result);
  }

  async deleteEvent(eventId: string) {
    const result = await this.deleteEventUseCase.execute(eventId);
    return result;
  }

  async getOneEvent(eventId: string) {
    const result = await this.getOneEventUseCase.execute(eventId);
    return this.flattenEvent(result);
  }

  async getEventsByType(type: string, pageNumber: number, pageSize: number) {
    const result = await this.getEventsByTypeUseCase.execute(type, pageNumber, pageSize);
    return {
      list: result.list.map((event) => this.flattenEvent(event)),
      count: result.count,
    };
  }

  async getEventsByTeam(teamId: string, pageNumber: number, pageSize: number) {
    const result = await this.getEventsByTeamUseCase.execute(teamId, pageNumber, pageSize);
    return {
      list: result.list.map((event) => this.flattenEvent(event)),
      count: result.count,
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
        id: attendee.props.id,
        userId: attendee.props.userId,
        eventId: attendee.props.eventId,
        checkInMethod: attendee.props.checkInMethod,
        checkedInAt: attendee.props.checkedInAt.toISOString(),
      })),
      count: result.count,
    };
  }

  async listEvents(pageNumber: number, pageSize: number, filters?: { type?: string; teamId?: string }) {
    const result = await this.listEventsUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: result.list.map((event) =>  this.flattenEvent(event)),
      count: result.count,
    };
  }

  async updateEvent(eventId: string, dto: EventUpdateProps) {
    const result = await this.updateEventUseCase.execute(eventId, dto);
    return this.flattenEvent(result);
  }
}
