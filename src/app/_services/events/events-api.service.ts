import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { ICreateEventRequest } from '../../_models/create-event-request';
import { AppConfig } from '../../config/config';
import { GetEventsByBUIdRequest } from '../../_interfaces/events-by-bu-id-request';
import { BookEventRequest } from '../../_interfaces/book-event-request';
import { AcceptDeclineEventRequest } from '../../_interfaces/accept-decline-event-request';
import { GetEventByUserIdRequest } from '../../_interfaces/get-event-by-user-id-request';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) {}

  private serverUrl = this.config.setting['pathApi'] + 'event/';

  addEventToBusinessUserCalendar(event: ICreateEventRequest) {
    return this.requestHandlerService.sendPostRequest(this.serverUrl + 'create', event);
  }

  updateEventToBusinessUserCalendar(event: ICreateEventRequest) {
    return this.requestHandlerService.sendPatchRequest(`${this.serverUrl}${event.id}`, event);
  }

  deleteBusinessUserEvent(eventId: number) {
    return this.requestHandlerService.sendDeleteRequest(`${this.serverUrl}${eventId}`);
  }

  getAllEventsByBusinessUserId(request: GetEventsByBUIdRequest) {
    return this.requestHandlerService.sendPostRequest(`${this.serverUrl}getAllEventsByBusinessUserId`, request);
  }

  bookEvent(request: BookEventRequest) {
    return this.requestHandlerService.sendPostRequest(`${this.serverUrl}bookEvent`, request);
  }

  acceptEventRequest(request: AcceptDeclineEventRequest) {
    return this.requestHandlerService.sendPostRequest(`${this.serverUrl}acceptEventRequest`, request);
  }

  declineEventRequest(request: AcceptDeclineEventRequest) {
    return this.requestHandlerService.sendPostRequest(`${this.serverUrl}declineEventRequest`, request);
  }

  getEventByUserId(request: GetEventByUserIdRequest) {
    return this.requestHandlerService.sendPostRequest(`${this.serverUrl}getEventByUserId`, request);
  }
}
