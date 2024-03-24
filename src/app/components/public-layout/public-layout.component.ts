import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styles: [
    `
        .app-container {
            overflow-x: hidden;
            height: 100%;
        }
    `
    ]
})
export class PublicLayoutComponent implements OnInit {
    @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;

	constructor(
        private notificationStateService: NotificationsStateService,
    ) {}

    ngOnInit(): void {
        this.notificationStateService.initializeNotificationsListSidenav(this.drawer);
    }
}
