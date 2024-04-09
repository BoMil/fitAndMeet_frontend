import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationType } from 'src/app/_enums/notification-type';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';
import { FollowRequest } from 'src/app/_interfaces/follow-request';
import { GetEndUserDetailsRequest } from 'src/app/_interfaces/get-end-user-details-request';
import { User } from 'src/app/_models/user';
import { FollowApiService } from 'src/app/_services/api-services/follow-api.service';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { ModalService } from 'src/app/_services/modal.service';
import { EventModel } from '../../../_models/event';
import { EventsApiService } from '../../../_services/events/events-api.service';
import { AcceptDeclineEventRequest } from '../../../_interfaces/accept-decline-event-request';
import { GetEventByUserIdRequest } from '../../../_interfaces/get-event-by-user-id-request';
import { UserEventStatus } from '../../../_enums/user-event-status';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {
    notificationType = NotificationType;
    user: User | null = null;
    event: EventModel | null = null;
	isInitialLoad: boolean = true;
    eventStatus = UserEventStatus;

    constructor(
        private followApiService: FollowApiService,
        private userApiService: UserApiService,
        private eventsApiService: EventsApiService,
        private toastr: ToastrService,
        public modalService: ModalService,
        public notificationsStateService: NotificationsStateService,
    ) { }

    ngOnInit(): void {
        this.getDetailsData();
    }

    getDetailsData() {
        console.log('getDetailsData selectedNotification', this.notificationsStateService.selectedNotification);

        if (!this.notificationsStateService.selectedNotification) {
            return;
        }

        // Get follower user details with follow status
        if (this.notificationsStateService.selectedNotification.notificationType === NotificationType.FOLLOW_REQUEST_PENDING) {
            const request: GetEndUserDetailsRequest = {
                endUserId: this.notificationsStateService.selectedNotification.notificationTriggerUserId || 0,
                businessUserId: this.notificationsStateService.selectedNotification.userId
            }
            this.userApiService.getEndUserDetails(request).subscribe({
                next: (data) => {
                    this.user = new User(data);
                    console.log('getEndUserDetails', data);
                },
                error: (err) => {
                    this.toastr.error('Failed to get end user details');
                    console.error('getEndUserDetails err', err);
                },
            });
        }

        if (this.notificationsStateService.selectedNotification.notificationType === NotificationType.EVENT_REQUEST_PENDING) {
            const request: GetEventByUserIdRequest = {
                eventId: this.notificationsStateService.selectedNotification?.eventId ? Number(this.notificationsStateService.selectedNotification?.eventId) : 0,
                businessUserId: this.notificationsStateService.selectedNotification?.userId ? Number(this.notificationsStateService.selectedNotification?.userId) : 0
            }
    
            this.eventsApiService.getEventByUserId(request).subscribe({
                next: (data) => {
                    this.event = new EventModel(data);
                    console.log('getEventByUserId', data);
                },
                error: (err) => {
                    this.toastr.error('Failed to get event');
                    console.error('getEventByUserId err', err);
                },
            });
        }
    }

    acceptFollowRequest() {
        if (!this.notificationsStateService.selectedNotification?.notificationTriggerUserId) {
            return;
        }

        const request: FollowRequest = {
            followerUserId: Number(this.notificationsStateService.selectedNotification.notificationTriggerUserId),
            userToFollowId: Number(this.notificationsStateService.selectedNotification?.userId),
        };

        this.followApiService.acceptFollowRequest(request).subscribe({
            next: (data) => {
                console.log('acceptFollowRequest', data);
                // Refresh user details to hide action buttons
                this.getDetailsData();
            },
            error: (err) => {
                console.log('acceptFollowRequest', err);
            }
        }); 
    }

    declineFollowRequest() {
        if (!this.notificationsStateService.selectedNotification?.notificationTriggerUserId) {
            return;
        }

        const request: FollowRequest = {
            followerUserId: this.notificationsStateService.selectedNotification.notificationTriggerUserId,
            userToFollowId: this.notificationsStateService.selectedNotification?.userId,
        };

        this.followApiService.declineFollowRequest(request).subscribe({
            next: (data) => {
                console.log('declineFollowRequest', data);
                // Refresh user details to hide action buttons
                this.getDetailsData();
            },
            error: (err) => {
                console.log('declineFollowRequest', err);
            }
        }); 
    }

    closeModal() {
		if (this.isInitialLoad) {
			this.isInitialLoad = false;
			return;
		}

		this.modalService.closeModal();
	}

    acceptEventRequest() {
        if (!this.notificationsStateService.selectedNotification?.eventId || this.notificationsStateService.selectedNotification?.notificationTriggerUserId || this.notificationsStateService.selectedNotification?.userId) {
            this.toastr.error('Request data are not valid');
            return;
        }
        const request: AcceptDeclineEventRequest = {
            eventId: Number(this.notificationsStateService.selectedNotification?.eventId),
            endUserId: Number(this.notificationsStateService.selectedNotification?.notificationTriggerUserId),
            businessUserId: Number(this.notificationsStateService.selectedNotification?.userId)
        }

        this.eventsApiService.acceptEventRequest(request).subscribe({
            next: (data) => {
                // this.user = new User(data);
                console.log('acceptEventRequest', data);
                this.getDetailsData();
            },
            error: (err) => {
                this.toastr.error('Failed to accept event request');
                console.error('acceptEventRequest err', err);
            },
        });
    }

    declineEventRequest() {
        if (!this.notificationsStateService.selectedNotification?.eventId || this.notificationsStateService.selectedNotification?.notificationTriggerUserId || this.notificationsStateService.selectedNotification?.userId) {
            this.toastr.error('Request data are not valid');
            return;
        }

        const request: AcceptDeclineEventRequest = {
            eventId: Number(this.notificationsStateService.selectedNotification?.eventId),
            endUserId: Number(this.notificationsStateService.selectedNotification?.notificationTriggerUserId),
            businessUserId: Number(this.notificationsStateService.selectedNotification?.userId)
        }

        this.eventsApiService.declineEventRequest(request).subscribe({
            next: (data) => {
                // this.user = new User(data);
                console.log('declineEventRequest', data);
                this.getDetailsData();
            },
            error: (err) => {
                this.toastr.error('Failed to decline event request');
                console.error('declineEventRequest err', err);
            },
        });
    }
}
