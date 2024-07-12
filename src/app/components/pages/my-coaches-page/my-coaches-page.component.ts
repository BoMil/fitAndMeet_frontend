import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { AuthStateService } from '../../../_global-state-services/auth/auth-state.service';
import { BuDashboardStateService } from '../../../_global-state-services/bu-dashboard/bu-dashboard-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../../_enums/auth';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventHoveringArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarView } from '../../../_enums/calendar-view';
import { EventModel } from '../../../_models/event';
import { HelperService } from '../../../common/services/helper.service';
import { RoleEnum } from '../../../_enums/user-role';
import { CoachContactBoxComponent } from '../../coach-contact-box/coach-contact-box.component';
import { GetEventsByBUIdRequest } from '../../../_interfaces/events-by-bu-id-request';
import { EventsApiService } from '../../../_services/events/events-api.service';
import { EventsRepackService } from '../../../_services/events/events-repack.service';
import { EventBoxComponent } from '../business-user-dashboard-page/event-box/event-box.component';
import { BookEventRequest } from '../../../_interfaces/book-event-request';

@Component({
  selector: 'app-my-coaches-page',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    CoachContactBoxComponent,
    EventBoxComponent,
  ],
  templateUrl: './my-coaches-page.component.html',
  styleUrls: ['./my-coaches-page.component.scss', '../../../../styles/_calendar.scss', '../../../../styles/_keen_slider.scss']
})
export class MyCoachesPageComponent implements OnInit, OnDestroy, AfterViewInit {
    calendarOptions: CalendarOptions = {
        locale: 'sr',
		plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
		headerToolbar: {
			left: 'title',
			// left: 'prev,next today',
			// center: 'title',
            right: 'prev,next today'
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

    @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>;
	@ViewChild('calendar') calendarComponent!: FullCalendarComponent;


    currentSlide: number = 1
    dotHelper: Array<Number> = []
    slider: KeenSliderInstance | null= null;
    role = RoleEnum;

    constructor(
        public authStateService: AuthStateService,
        public buDashboardStateService: BuDashboardStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private helperService: HelperService,
		private changeDetector: ChangeDetectorRef,
		private eventsApiService: EventsApiService,
		private repackEventsService: EventsRepackService,
    ) {}

    ngOnInit(): void {
        this.listenIfUserLogout();
        this.getAllFollowedBusinessUsers();
        this.listenWhenUsersAreFetched();
    }

    ngAfterViewInit(): void {
        this.translateToday();
        
    }

    translateToday() {
        let todayBtn = document.querySelectorAll('.fc-today-button')[0];
        todayBtn.innerHTML = 'Danas';
        // console.log('todayBtn', todayBtn);
    }

    listenWhenUsersAreFetched() {
        // Init slider only when the users are fetched
        this.buDashboardStateService.usersAreFetched.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (state) => {
                    setTimeout(() => {
                        this.slider = new KeenSlider(this.sliderRef?.nativeElement, {
                          initial: this.currentSlide,
                          slideChanged: (s: KeenSliderInstance) => {
                            console.log('Slide changed', s);
                            this.currentSlide = s.track.details.rel;
                            this.buDashboardStateService.currentDashboardBusinessUser = this.buDashboardStateService.allDashboardBusinessUsers[this.currentSlide];
                            this.fetchBusinesUserEvents();
                            console.log('Current user', this.buDashboardStateService.currentDashboardBusinessUser);
                          },
                        });
            
                        console.log('Slide INIT', this.slider);
                        this.fetchBusinesUserEvents();
                        this.dotHelper = []
                        for (let index = 0; index < this.buDashboardStateService.allDashboardBusinessUsers.length; index++) {
                            this.dotHelper.push(index);
                        }
                    });
                }
            }
        );
    }

    ngOnDestroy(): void {
        if (this.slider) {
            this.slider?.destroy();
        }
        this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
    }

    listenIfUserLogout() {
        // Listen when the user logout and redirect him to home page
        this.authStateService.authStateChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (state) => {
                    if (state === Auth.UNAUTHENTICATED) {
                        this.router.navigateByUrl('');
                    }
                }
            }
        );
    }

    getAllFollowedBusinessUsers() {
        if (!this.authStateService.currentUser) {
            return;
        }
        this.buDashboardStateService.fetchAllFollowedBusinessUsers(this.authStateService.currentUser.id);
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

        // this.eventFormStateService.fillEventForm({
        //     description: '',
        //     startTime: selectInfo.start,
        //     endTime: selectInfo.end,
        //     userId: this.buDashboardStateService.currentDashboardBusinessUser?.id,
        //     numberOfAttendees: 1
        // });
        // this.modalService.openCreateEventFormModal();
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
        // this.eventFormStateService.fillEventForm({
        //     description: clickInfo.event.title,
        //     startTime: clickInfo.event.start,
        //     endTime: clickInfo.event.end,
        //     eventId: Number(clickInfo.event.id),
        //     userId: this.buDashboardStateService.currentDashboardBusinessUser.id,
        //     numberOfAttendees: clickInfo.event.extendedProps['numberOfAttendees'] ?? 1,
        // });
        // this.modalService.openEditEventFormModal();
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
}


