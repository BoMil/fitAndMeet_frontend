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

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {
    notificationType = NotificationType;
    user: User | null = null;
	isInitialLoad: boolean = true;

    constructor(
        private followApiService: FollowApiService,
        private userApiService: UserApiService,
        private toastr: ToastrService,
        public modalService: ModalService,
        public notificationsStateService: NotificationsStateService,
    ) { }

    ngOnInit(): void {
        this.getUserDetails();
    }

    getUserDetails() {
        console.log('getEndUserDetails selectedNotification', this.notificationsStateService.selectedNotification);

        if (!this.notificationsStateService.selectedNotification) {
            return;
        }

        // Get follower user details with follow status
        if (this.notificationsStateService.selectedNotification.notificationType === NotificationType.FOLLOW_REQUEST_PENDING) {
            const request: GetEndUserDetailsRequest = {
                endUserId: this.notificationsStateService.selectedNotification.followerUserId || 0,
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
    }

    acceptFollowRequest() {
        if (!this.notificationsStateService.selectedNotification?.followerUserId) {
            return;
        }

        const request: FollowRequest = {
            followerUserId: this.notificationsStateService.selectedNotification.followerUserId,
            userToFollowId: this.notificationsStateService.selectedNotification?.userId,
        };

        this.followApiService.acceptFollowRequest(request).subscribe({
            next: (data) => {
                console.log('acceptFollowRequest', data);
                // Refresh user details to hide action buttons
                this.getUserDetails();
            },
            error: (err) => {
                console.log('acceptFollowRequest', err);
            }
        }); 
    }

    declineFollowRequest() {
        if (!this.notificationsStateService.selectedNotification?.followerUserId) {
            return;
        }

        const request: FollowRequest = {
            followerUserId: this.notificationsStateService.selectedNotification.followerUserId,
            userToFollowId: this.notificationsStateService.selectedNotification?.userId,
        };

        this.followApiService.declineFollowRequest(request).subscribe({
            next: (data) => {
                console.log('declineFollowRequest', data);
                // Refresh user details to hide action buttons
                this.getUserDetails();
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
}