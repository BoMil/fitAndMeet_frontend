import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { EventBoxComponent } from '../pages/business-user-dashboard-page/event-box/event-box.component';
import { EventModel } from '../../_models/event';

@Component({
    selector: 'calendar-event',
    standalone: true,
    imports: [ CommonModule, EventBoxComponent ],
    styleUrls: ['./calendar-event.component.scss'],
    template: `
            <div #eventCardRef (click)="showEventCard()" class="cal-event" [ngClass]="{
                available: status === 'available',
                unavailable: status === 'unavailable',
                pending: status === 'pending',
                accepted: status === 'accepted',
                declined: status === 'declined'}">
                <div class="cal-event-time" [ngClass]="{
                    available: status === 'available',
                    unavailable: status === 'unavailable',
                    pending: status === 'pending',
                    accepted: status === 'accepted',
                    declined: status === 'declined'}">
                    {{ timeText }}
                </div>
                <div class="cal-event-title" >
                    {{ title }}
                </div>

                <div class="bottom-section">
                    <div class="attendees-num small">
                        <img src="../../../../assets/svg/user.svg" alt="User icon">
                        <span class="attendees-value">{{ acceptedAttendees }} / {{ numberOfAttendees }}</span>
                    </div>
                    <img *ngIf="status === 'pending'" class="waiting" src="../../../../assets/svg/waiting.svg" alt="Waiting icon">
                </div>

                <div #eventCardContainer *ngIf="isEventCardVisible && eventCard" class="event-container">
                    <event-box
                        (bookEvent)="bookEvent.emit($event)"
                        [isEndUser]="isEndUser"
                        [data]="eventCard" />
                </div>
            </div>
        `,
})
export class CalendarEventComponent {
    @Input() status: string = '';
    @Input() timeText: string = '';
    @Input() title: string = '';
    @Input() eventId: number = 0;
    @Input() acceptedAttendees: number = 0;
    @Input() numberOfAttendees: number = 0;
    @Input() availableEvents: EventModel[] = [];
    @Input() isEndUser: boolean = false;
    @Output() bookEvent: EventEmitter<EventModel> = new EventEmitter();

    eventCard!: EventModel;
    isEventCardVisible: boolean = false;

    // Props used to close a event card when the user clicks somewhere outside
    @ViewChild('eventCard') eventCardRef!: ElementRef;
    @ViewChild('eventCardContainer') eventCardContainer!: ElementRef;
    @HostListener('document:mousedown', ['$event'])
    onOutsideClick(event: any): void {
        if (!this.eventCardRef?.nativeElement.contains(event.target) && this.isEventCardVisible && !this.eventCardContainer?.nativeElement.contains(event.target)) {
            this.isEventCardVisible = false;
        }
    }

    showEventCard() {
        const eventCard: EventModel | undefined = this.availableEvents.find((el: EventModel) => el.id === Number(this.eventId));
        this.isEventCardVisible = true;

        if (eventCard) {
            this.eventCard = eventCard;
        }
    }
}
