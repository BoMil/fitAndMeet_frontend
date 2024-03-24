import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventHoveringArg } from '@fullcalendar/core';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from 'src/app/_enums/auth';
import { CalendarView } from 'src/app/_enums/calendar-view';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { EventFormStateService } from 'src/app/_global-state-services/events/event-form-state.service';
import { EventModel } from 'src/app/_models/event';
import { InfoBoxData } from 'src/app/_models/info-box-data';
import { User } from 'src/app/_models/user';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
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

	constructor(
		private changeDetector: ChangeDetectorRef,
		private eventsApiService: EventsApiService,
		private repackEventsService: EventsRepackService,
		private modalService: ModalService,
		public eventFormStateService: EventFormStateService,
        private activatedRoute: ActivatedRoute,
        private userService: UserApiService,
        public authStateService: AuthStateService,
        private router: Router,
        private helperService: HelperService,
        public buDashboardStateService: BuDashboardStateService,

	) {}
	ngOnInit() {
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
        const userId = this.activatedRoute.snapshot.paramMap.get("id");

        if (!userId) {
           return;
        }

		this.eventsApiService.getAllEventsByBusinessUser(Number(userId)).subscribe((data) => {
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

        this.getEventsByDate(selectInfo.start);

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
}
