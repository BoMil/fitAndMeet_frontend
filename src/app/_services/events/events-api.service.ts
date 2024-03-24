import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { ICreateEventRequest } from '../../_models/create-event-request';
import { AppConfig } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) {}

  private serverUrl = this.config.setting['pathApi'] + 'event/';

  getAllEventsByBusinessUser(userId: number) {
    return this.requestHandlerService.sendGetRequest(`${this.serverUrl}user/${userId}`, null);
  }

  addEventToBusinessUserCalendar(event: ICreateEventRequest) {
    return this.requestHandlerService.sendPostRequest(this.serverUrl + 'create', event);
  }

  updateEventToBusinessUserCalendar(event: ICreateEventRequest) {
    return this.requestHandlerService.sendPatchRequest(`${this.serverUrl}${event.id}`, event);
  }

  deleteBusinessUserEvent(eventId: number) {
    return this.requestHandlerService.sendDeleteRequest(`${this.serverUrl}${eventId}`);
  }
}
