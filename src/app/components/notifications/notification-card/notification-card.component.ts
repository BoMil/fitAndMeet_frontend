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
    isDetailsOptionVisible: boolean = false;

    constructor(
        private followApiService: FollowApiService,
        private toastr: ToastrService,
        public notificationsStateService: NotificationsStateService,
    ) { }

    ngOnInit(): void {
        this.isDetailsOptionVisible = this.notification.notificationType === NotificationType.FOLLOW_REQUEST_PENDING
        || this.notification.notificationType === NotificationType.EVENT_REQUEST_PENDING;
    }
}
