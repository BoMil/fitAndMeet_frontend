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
    acceptedAttendees: number;
    sortedEventUsers: SortedEventUsers;

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
        this.acceptedAttendees = this.calculateAcceptedAttendees(this.userEvents);
        this.sortedEventUsers = this.sortUsersByStatus(this.userEvents);
    }

    calculateAcceptedAttendees(events: UserEvent[]): number {
        const acceptedEvents: UserEvent[] = events.filter((el: UserEvent) => el.userEventStatus === UserEventStatus.ACCEPTED);
        return acceptedEvents.length;
    }

    sortUsersByStatus(userEvents: UserEvent[]): SortedEventUsers {
        let pendingUsers: UserEvent[] = [];
        let acceptedUsers: UserEvent[] = [];
        let sorted:UserEvent[][] = [];

        for (let index = 0; index < userEvents.length; index++) {
            const element: UserEvent = userEvents[index];
            if (element.userEventStatus === UserEventStatus.ACCEPTED) {
                acceptedUsers.push(element);
            } else if (element.userEventStatus === UserEventStatus.PENDING) {
                pendingUsers.push(element);
            }
        }

        if (pendingUsers.length) {
            sorted.push(pendingUsers);
        } else if (acceptedUsers.length) {
            sorted.push(acceptedUsers);
        }

        return {
            pendingUsers: pendingUsers,
            acceptedUsers: acceptedUsers
        };
    }
}

export class UserEvent {
    id: number;
    userEventStatus: UserEventStatus;
    event_id: number;
    user_id: number;
    userFirstName: string;
    userLastName: string;
    userAvatar: string;
    statusText: string;
    userFullName: string;

    constructor(data?: any) {
        this.id = data?.id;
        this.user_id = data?.user_id ?? 0;
        this.userEventStatus = data?.userEventStatus;
        this.event_id = data?.event_id ?? 0;
        this.userFirstName = data?.userFirstName ?? '';
        this.userLastName = data?.userLastName ?? '';
        this.userAvatar = data?.userAvatar ?? '';
        this.statusText = this.createStatusText(this.userEventStatus);
        this.userFullName = `${this.userFirstName} ${this.userLastName}`;
    }

    createStatusText(status: UserEventStatus) {
        switch (status) {
            case UserEventStatus.AVAILABLE:
                return 'Dostupan termin';
            case UserEventStatus.ACCEPTED:
                return 'Potvrđeno';
            case UserEventStatus.PENDING:
                return 'Na čekanju';
            case UserEventStatus.DECLINED:
                return 'Odbijen';
            case UserEventStatus.UNAVAILABLE:
                return 'Nedostupan';
            default:
                return 'Nepoznat status';
        }
    }
}

export interface SortedEventUsers {
    pendingUsers: UserEvent[];
    acceptedUsers: UserEvent[];
}
