import { Injectable } from '@angular/core';
import { ICreateEventRequest } from 'src/app/_models/create-event-request';

@Injectable({
  providedIn: 'root'
})
export class EventsRepackService {

  constructor() { }

  repackServerEventsToCalendar(events: any[]): any[] {
    return events.map((element: ICreateEventRequest) => 
      {
        return {
          id: element.id,
          title: element.description,
          start: element.start_at,
          end: element.end_at,
          status: element.status,
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
