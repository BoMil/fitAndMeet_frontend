import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';
import { WSNotificationContent } from 'src/app/_interfaces/ws-notification-content';
import { WebsocketService } from 'src/app/_services/websocket-service/websocket.service';

@Component({
  selector: 'app-notification-icon',
  template: `
    <span class="notifications-box">
        <mat-icon [matBadge]="notificationStateService.unreadNotificationsCount" matBadgeColor="warn" (click)="notificationStateService.toggleNotificationsListSidenav()">notifications_active</mat-icon>
    </span>
  `,
})
export class NotificationIconComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject();

    constructor(
        private authStateService: AuthStateService,
        private websocketService: WebsocketService,
        public notificationStateService: NotificationsStateService,
    ) {}

    ngOnInit(): void {
        this.subscribeToWebSockets();
        this.notificationStateService.getAllNotificationsByUserId();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
        if (!this.authStateService.currentUser) {
            return;
        }
        const userRoomId: string = this.authStateService.currentUser.id.toString();
        this.websocketService.leaveRoom(userRoomId);
    }

    subscribeToWebSockets() {
        if (!this.authStateService.currentUser) {
            return;
        }
        const userRoomId: string = this.authStateService.currentUser.id.toString();
        // TODO: Uncoment when fix sockets on the vercel
        // this.websocketService.leaveRoom(userRoomId);
        // this.websocketService.joinRoom(userRoomId);
        // this.websocketService.listenForMessages('newNotification').pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        //     next: (value: WSNotificationContent) => {
        //         console.log('newNotification message', value);
        //         this.notificationStateService.userNotificationArrived.next(value);

        //         if (value?.unreadNotificationsCount) {
        //             this.notificationStateService.unreadNotificationsCount = value?.unreadNotificationsCount;
        //         }

        //         // if (value.type === NotificationType.FOLLOW_REQUEST) {
                    
        //         // }
        //     },
        //     error: (err: any) => {
        //         console.error('newNotification err', err);
        //     },
        // });
    }
}
