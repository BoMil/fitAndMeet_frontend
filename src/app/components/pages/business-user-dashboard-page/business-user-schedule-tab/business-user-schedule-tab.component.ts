import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventHoveringArg } from '@fullcalendar/core';
import { Subject, takeUntil } from 'rxjs';
import { CalendarView } from 'src/app/_enums/calendar-view';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { EventFormStateService } from 'src/app/_global-state-services/events/event-form-state.service';
import { EventModel } from 'src/app/_models/event';
import { EventsApiService } from 'src/app/_services/events/events-api.service';
import { EventsRepackService } from 'src/app/_services/events/events-repack.service';
import { ModalService } from 'src/app/_services/modal.service';
import { HelperService } from 'src/app/common/services/helper.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { BuDashboardStateService } from 'src/app/_global-state-services/bu-dashboard/bu-dashboard-state.service';
import { RoleEnum } from 'src/app/_enums/user-role';
import { GetEventsByBUIdRequest } from '../../../../_interfaces/events-by-bu-id-request';
import { BookEventRequest } from '../../../../_interfaces/book-event-request';
import { ToastrService } from 'ngx-toastr';
import { NotificationsStateService } from '../../../../_global-state-services/notifications/notifications-state.service';
import { WSNotificationContent } from '../../../../_interfaces/ws-notification-content';
import { NotificationType } from '../../../../_enums/notification-type';

@Component({
  selector: 'app-business-user-schedule-tab',
  templateUrl: './business-user-schedule-tab.component.html',
  styleUrls: ['./business-user-schedule-tab.component.scss']
})
export class BusinessUserScheduleTabComponent implements OnInit {
    // calendarVisible = true;

	calendarOptions: CalendarOptions = {
		plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
		// plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
            right: ''
			// right: `${CalendarView.DAY_VIEW},${CalendarView.MONTH_VIEW},${CalendarView.WEEK_VIEW},${CalendarView.LIST_VIEW}`,
			// right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		initialView: CalendarView.WEEK_VIEW,
		// initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
		weekends: true,
		// editable: true,
		selectable: true,
		selectMirror: true,
		dayMaxEvents: true,
        selectLongPressDelay: 25,
        // eventBackgroundColor: '',
		select: this.handleDateSelect.bind(this),
		eventClick: this.handleEventClick.bind(this),
		eventsSet: this.handleEvents.bind(this),
		eventMouseEnter: this.onEventMouseEnter.bind(this),
		eventMouseLeave: this.onEventMouseLeave.bind(this),
		// eventMouseEnter: Identity<(arg: EventHoveringArg) => void>;
		// eventMouseLeave: Identity<(arg: EventHoveringArg) => void>;

		/* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
	};
	currentEvents: EventApi[] = [];
	ngUnsubscribe = new Subject();
	// references the #calendar in the template
	@ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    // currentBusinesUserId!: number;
    // currentBusinessUser!: User | null;
    // userInfoBox!: InfoBoxData | null;
	// allEvents: EventModel[] = [];
	// selectedDayEvents: EventModel[] = [];
    role = RoleEnum;

	constructor(
		private changeDetector: ChangeDetectorRef,
		private eventsApiService: EventsApiService,
		private repackEventsService: EventsRepackService,
		private modalService: ModalService,
		public eventFormStateService: EventFormStateService,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        public authStateService: AuthStateService,
        private router: Router,
        private helperService: HelperService,
        public buDashboardStateService: BuDashboardStateService,
        public notificationStateService: NotificationsStateService,

	) {}
	ngOnInit() {
        this.listenWhenUserNotificationsArrived();
        this.fetchBusinesUserEvents();

        // End user can't create/edit events
        if (this.authStateService.currentUser?.role === RoleEnum.END_USER) {
            return;
        }
        this.listenWhenEventUpdatedCreatedOrDeleted();
	}
 
	ngOnDestroy() {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
	}

    addUserEventsToCalendar() {
        this.getEventsByDate(new Date());

        console.log('allEvents', this.buDashboardStateService.allEvents);
        const calendarApi = this.calendarComponent.getApi();

        let events = this.repackEventsService.repackServerEventsToCalendar(this.buDashboardStateService.allEvents);

        calendarApi.removeAllEvents(); // clear date selection
        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            calendarApi.addEvent(element);
        }
    }

	fetchBusinesUserEvents() {
        let businessUserId: number = this.buDashboardStateService.currentDashboardBusinessUser?.id ?? 0;
        let endUserId: number | null = null;
        // First check if the current user is end user
        if (this.authStateService.currentUser?.role === RoleEnum.END_USER) {
            endUserId = this.authStateService.currentUser?.id ?? 0;
        }

        const request: GetEventsByBUIdRequest = {
            businessUserId: businessUserId
        }

        if (endUserId) {
            request.endUserId = endUserId;
        }

		this.eventsApiService.getAllEventsByBusinessUserId(request).subscribe((data) => {
            this.buDashboardStateService.allEvents = [];

            for (let index = 0; index < data.length; index++) {
				const element: EventModel = new EventModel(data[index]);
                this.buDashboardStateService.allEvents.push(element);
			}

            this.addUserEventsToCalendar();
		});
	}

	handleWeekendsToggle() {
		const { calendarOptions } = this;
		calendarOptions.weekends = !calendarOptions.weekends;
	}

	handleDateSelect(selectInfo: DateSelectArg) {
		// this.modalService.toggleModal({id: 'event-form', opened: true});
		console.log('handleDateSelect', selectInfo);
        this.getEventsByDate(selectInfo.start);

        // Disable event creation in case it is not business user
        if (!this.buDashboardStateService.currentDashboardBusinessUser || this.authStateService.currentUser?.role !== RoleEnum.BUSINESS_USER) {
            this.calendarComponent.getApi().unselect();
            return;
        }

		const calendarApi = this.calendarComponent.getApi();
        calendarApi.getCurrentData();

        // Example how to change from one view to another
		// if (selectInfo.view.type === CalendarView.MONTH_VIEW) {
		// 	calendarApi.changeView('timeGridDay', selectInfo.startStr);
		// }

        // Don't open the form if user click on all day
        if (selectInfo.allDay) {
            return;
        }

        this.eventFormStateService.fillEventForm({
            description: '',
            startTime: selectInfo.start,
            endTime: selectInfo.end,
            userId: this.buDashboardStateService.currentDashboardBusinessUser?.id
        });
        this.modalService.openCreateEventFormModal();
	}

	handleEventClick(clickInfo: EventClickArg) {
		console.log('handleEventClick', clickInfo);

        if (!clickInfo.event.start) {
            return;
        }
        this.getEventsByDate(clickInfo.event.start);

        // Disable event edit in case it is not business user
        if (!this.buDashboardStateService.currentDashboardBusinessUser || this.authStateService.currentUser?.role !== RoleEnum.BUSINESS_USER) {
            return;
        }

		// Populate event form
        this.eventFormStateService.fillEventForm({
            description: clickInfo.event.title,
            startTime: clickInfo.event.start,
            endTime: clickInfo.event.end,
            eventId: Number(clickInfo.event.id),
            userId: this.buDashboardStateService.currentDashboardBusinessUser.id
        });
        this.modalService.openEditEventFormModal();
	}

	handleEvents(events: EventApi[]) {
		console.log('handleEvents', events);
		this.currentEvents = [];
		this.currentEvents = events;
		this.changeDetector.detectChanges();
	}

	onEventMouseEnter(eventArg: EventHoveringArg) {
		// console.log('onEventMouseEnter', eventArg);
	}

	onEventMouseLeave(eventArg: EventHoveringArg) {
		// console.log('onEventMouseLeave', eventArg);
	}

    listenWhenEventUpdatedCreatedOrDeleted() {
        // Listen when the event is updated, created or deleted from the event form
		this.eventFormStateService.eventUpdatedCreatedOrDeleted.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
			// Reload events
			// this.buDashboardStateService.fetchBusinesUserEvents();
            this.addUserEventsToCalendar();
			this.modalService.closeModal();
		});
    }

    private getEventsByDate(date: Date) {
        this.buDashboardStateService.selectedDayEvents = [];
        for (let index = 0; index < this.buDashboardStateService.allEvents.length; index++) {
            const event: EventModel = this.buDashboardStateService.allEvents[index];
            if (event.start_at && this.helperService.isSameDay(new Date(event.start_at), date)) {
                this.buDashboardStateService.selectedDayEvents.push(event);
            }
        }

        console.log('Events on selected day', this.buDashboardStateService.selectedDayEvents);
    }

    bookEvent(event: EventModel) {
        const request: BookEventRequest = {
            eventId: event.id ?? 0,
            endUserId: this.authStateService.currentUser?.id ?? 0
        }

        // Send request
        this.eventsApiService.bookEvent(request).subscribe({
            next: (value) => {
                // If successful refresh the list of events with new statuses
                const updatedEvent: EventModel = new EventModel(value);
                console.log('updatedEvent', updatedEvent);

                // Find event and update it's status
                for (let index = 0; index < this.buDashboardStateService.allEvents.length; index++) {
                    const element = this.buDashboardStateService.allEvents[index];
                    if (element.id === updatedEvent.id) {
                        element.userStatus = updatedEvent.userStatus;
                        break;
                    }
                }

                this.addUserEventsToCalendar();
            },
            error: (err) => {
                this.toastr.error('Failed to book event');
            },
        });
    }

    listenWhenUserNotificationsArrived() {
        if (!this.authStateService.currentUser) {
            return;
        }

        this.notificationStateService.userNotificationArrived.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (notification: WSNotificationContent) => {
                    // console.warn('WEBSOCKET', notification);

                    // Every time some user book (end_user), accept or decline (business_user) event,
                    // reload the calendar to see the latest event statuses
                    if (notification.type === NotificationType.EVENT_REQUEST_ACCEPTED || notification.type === NotificationType.EVENT_REQUEST_DECLINED 
                        || notification.type === NotificationType.EVENT_REQUEST_PENDING || notification.type === NotificationType.EVENT_CREATED
                        || notification.type === NotificationType.EVENT_UPDATED) {
                        this.fetchBusinesUserEvents();
                    }
                }
            }
        );
    }
}
