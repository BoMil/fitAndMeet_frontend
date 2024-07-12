import { Injectable } from '@angular/core';
import { ICreateEventRequest } from 'src/app/_models/create-event-request';
import { EventModel } from '../../_models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsRepackService {

  constructor() { }

  repackServerEventsToCalendar(events: any[]): any[] {
    return events.map((element: EventModel) => 
      {
        return {
          id: element.id,
          title: element.description,
          start: element.start_at,
          end: element.end_at,
          status: element.userStatus,
          numberOfAttendees: element.numberOfAttendees,
          acceptedAttendees: element.acceptedAttendees,
        }
      },
    )
  }

//   repackCalendarEventToServer(event: EventInput): CreateEventRequest {
//     return new CreateEventRequest({
//       id: event.id,
//       startTime: event.start,
//       endTime: event.end,
//       // timeCreated: '',
//       // lastUpdate: '',
//       idCreatorUser: 0,
//       note: 'some note',
//       description: event.title,
//       status: EventStatus.Pending,
//     })
//   }
}
