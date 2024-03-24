import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { EventsApiService } from 'src/app/_services/events/events-api.service';
import { ICreateEventRequest } from 'src/app/_models/create-event-request';
import { IEventFormData } from 'src/app/_interfaces/event-form-data';
import { ToastrService } from 'ngx-toastr';
import { EventModel } from 'src/app/_models/event';
import { BuDashboardStateService } from '../bu-dashboard/bu-dashboard-state.service';

@Injectable({
  providedIn: 'root'
})
export class EventFormStateService {

  public eventDescription: FormControl = new FormControl('', Validators.required);
  public eventStartTime!: Date | null;
  public eventEndTime!: Date | null;
  public eventId!: number;
  public userId!: number;
  public eventUpdatedCreatedOrDeleted: Subject<any> = new Subject();

  constructor(
    private eventsApiService: EventsApiService,
    private toastr: ToastrService,
    public buDashboardStateService: BuDashboardStateService,
    ) { }

  resetEventFormState() {
    this.eventDescription.setValue('');
    this.eventStartTime = null;
    this.eventEndTime = null;
  }

  updateEvent() {
    let serverRequest: ICreateEventRequest = {
        id: this.eventId,
        description: this.eventDescription.value,
        start_at: this.eventStartTime,
        end_at: this.eventEndTime,
        user_id: this.userId
    };

    this.eventsApiService.updateEventToBusinessUserCalendar(serverRequest).subscribe(
        {
            next: (data) => {
                this.toastr.success('Event updated successfully');
                let event: EventModel = new EventModel(data);

                // Update event from the list of all events in state service
                for (let index = 0; index < this.buDashboardStateService.allEvents.length; index++) {
                    let element: EventModel = this.buDashboardStateService.allEvents[index];
                    if (element.id === event.id) {
                        element.active = event.active;
                        element.updated_at = event.updated_at;
                        element.start_at = event.start_at;
                        element.end_at = event.end_at;
                        element.status = event.status;
                        element.description = event.description;
                        break;
                    }
                }
                this.eventUpdatedCreatedOrDeleted.next(true);
            },
            error: (err) => {
                this.toastr.error('Failed to update event');
                console.log('updateEventToBusinessUserCalendar error', err);
            }
        }
    );
  }

  deleteEvent() {
    this.eventsApiService.deleteBusinessUserEvent(this.eventId).subscribe(
        {
            next: (data) => {
                // Remove event from the list of all events in state service
                const eventIndex = this.buDashboardStateService.allEvents.findIndex((el: EventModel) => el.id === this.eventId);
                if (eventIndex !== -1) {
                    this.buDashboardStateService.allEvents.splice(eventIndex, 1);
                }

                this.eventUpdatedCreatedOrDeleted.next(true);
                this.toastr.success('Event deleted successfully');
            },
            error: (err) => {
                this.toastr.error('Failed to delete event');
                console.log('deleteEvent error', err);
            }
        }
      );
  }

  createEvent() {
    let serverRequest: ICreateEventRequest = {
        description: this.eventDescription.value,
        start_at: this.eventStartTime,
        end_at: this.eventEndTime,
        user_id: this.userId
    };

    this.eventsApiService.addEventToBusinessUserCalendar(serverRequest).subscribe(
        {
            next: (data) => {
                let event: EventModel = new EventModel(data);
                // Add new event to the list of all events in state service
                this.buDashboardStateService.allEvents.push(event);
                this.eventUpdatedCreatedOrDeleted.next(true);
                this.toastr.success('Event created successfully');
            },
            error: (err) => {
                this.toastr.error('Failed to create event');
                console.log('addBusinesUserEvent error', err);
            }
        }
    );
}

  fillEventForm(data: IEventFormData) {
    this.eventDescription.setValue(data.description);
    this.eventStartTime = data.startTime;
    this.eventEndTime = data.endTime;
    this.userId = data.userId;

    if (data.eventId) {
        this.eventId = data.eventId;
    }
  }
}
