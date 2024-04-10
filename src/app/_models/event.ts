import { EventStatus } from "../_enums/event-status";
import { UserEventStatus } from "../_enums/user-event-status";

export class EventModel {
    id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    start_at: string | Date;
    end_at: string | Date;
    status: EventStatus;
    description: string;
    active: boolean;
    userStatus: UserEventStatus;
    numberOfAttendees: number;
    userEvents: UserEvent[];
    ecceptedAttendees: number;

    constructor(data: any) {
        this.id = data?.id;
        this.user_id = data?.user_id ?? 0;
        this.created_at = data?.created_at ?? '';
        this.updated_at = data?.updated_at ?? '';
        this.start_at = data?.start_at ?? '';
        this.end_at = data?.end_at ?? '';
        this.active = data?.active ?? false;
        this.status = data?.status;
        this.description = data?.description ?? '';
        this.userStatus = data?.userStatus;
        this.numberOfAttendees = data?.numberOfAttendees ?? 1;
        this.userEvents = data?.userEvents?.length ? data?.userEvents.map((el: any) => new UserEvent(el)) : [];
        this.ecceptedAttendees = this.calculateAcceptedAttendees(this.userEvents);
    }

    calculateAcceptedAttendees(events: UserEvent[]): number {
        const acceptedEvents: UserEvent[] = events.filter((el: UserEvent) => el.userEventStatus === UserEventStatus.ACCEPTED);
        return acceptedEvents.length;
    }
}

export class UserEvent {
    id: number;
    userEventStatus: UserEventStatus;
    event_id: number;
    user_id: number;

    constructor(data?: any) {
        this.id = data?.id;
        this.user_id = data?.user_id ?? 0;
        this.userEventStatus = data?.userEventStatus;
        this.event_id = data?.event_id ?? 0;
    }
}
