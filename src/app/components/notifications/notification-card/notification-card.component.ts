import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationType } from 'src/app/_enums/notification-type';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';
import { NotificationModel } from 'src/app/_models/notification';
import { FollowApiService } from 'src/app/_services/api-services/follow-api.service';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {
    @Input() notification!: NotificationModel;
    notificationType = NotificationType;
    title: string = '';
    isDetailsOptionVisible: boolean = false;

    constructor(
        private followApiService: FollowApiService,
        private toastr: ToastrService,
        public notificationsStateService: NotificationsStateService,
    ) { }

    ngOnInit(): void {
        this.isDetailsOptionVisible = this.notification.notificationType === NotificationType.FOLLOW_REQUEST_PENDING
        || this.notification.notificationType === NotificationType.EVENT_REQUEST_PENDING;
        this.setTitle();
    }

    setTitle() {
        switch (this.notification.notificationType) {
            case NotificationType.FOLLOW_REQUEST_PENDING:
                this.title ='Follow request';
                break;
            case NotificationType.FOLLOW_REQUEST_ACCEPTED:
                this.title ='Follow request accepted';
                break;
            case NotificationType.FOLLOW_REQUEST_DECLINED:
                this.title ='Follow request declined';
                break;
            case NotificationType.EVENT_REQUEST_ACCEPTED:
                this.title ='Event request accepted';
                break;
            case NotificationType.EVENT_REQUEST_DECLINED:
                this.title ='Event request declined';
                break;
            case NotificationType.EVENT_REQUEST_PENDING:
                this.title ='Event request pending';
                break;
            default:
                this.title ='New Notification';
        }
    }
}
