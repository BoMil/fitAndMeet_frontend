import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
    color: ThemePalette = 'primary';

	constructor(
        public notificationsStateService: NotificationsStateService,
    ) {}

    ngOnInit(): void {
        this.notificationsStateService.getAllNotificationsByUserId();
    }

    readAllChanged(event: MatSlideToggleChange) {
        this.notificationsStateService.isReadAllChecked = event.checked;
        // console.log('isReadAllChecked', this.notificationsStateService.isReadAllChecked);
        if (event.checked) {
            this.notificationsStateService.readAllNotifications();
        }
    }
}
