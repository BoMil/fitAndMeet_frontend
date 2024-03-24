import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FindByUserIdRequest } from 'src/app/_interfaces/find-by-user-id-request';
import { NotificationModel } from 'src/app/_models/notification';
import { NotificationsApiService } from 'src/app/_services/api-services/notifications-api.service';
import { AuthStateService } from '../auth/auth-state.service';
import { ModalService } from 'src/app/_services/modal.service';
import { Subject } from 'rxjs';
import { WSNotificationContent } from 'src/app/_interfaces/ws-notification-content';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStateService {
    public drawer!: MatDrawer;
    public userNotifications: NotificationModel[] = [];
    public unreadNotificationsCount: any | null = null;
    public selectedNotification: NotificationModel | null = null;
    public userNotificationArrived: Subject<WSNotificationContent> = new Subject();
    public isReadAllChecked: boolean = false;
    public isReadAllDisabled: boolean = true;

    constructor(
        private authStateService: AuthStateService,
        private notificationsApiService: NotificationsApiService,
        private modalService: ModalService,
        private toastr: ToastrService,
    ) { }

    initializeNotificationsListSidenav(drawer: MatDrawer) {
        // console.log('initializeNotificationsListSidenav', drawer);
        this.drawer = drawer;
    }

    toggleNotificationsListSidenav() {
        if (!this.drawer) {
            return;
        }
        this.drawer.toggle();
    }

    closeNotificationsListSidenav() {
        if (!this.drawer || !this.drawer.opened) {
            return;
        }
        this.drawer.opened = false;
    }

    getAllNotificationsByUserId() {
        if (!this.authStateService.currentUser) {
            return;
        }

        const request: FindByUserIdRequest = {
            userId: this.authStateService.currentUser.id
        }

        this.notificationsApiService.getAllNotificationsByUserId(request).subscribe({
            next: (data) => {
                this.userNotifications = data?.notifications.length ? data?.notifications.map((el: any) => new NotificationModel(el)) : [];
                this.unreadNotificationsCount = data?.unreadNotificationsCount || null;
                if (this.unreadNotificationsCount) {
                    this.isReadAllChecked = false;
                    this.isReadAllDisabled = false;
                } else {
                    this.isReadAllChecked = true;
                    this.isReadAllDisabled = true;
                }
                // console.log('getAllNotificationsByUserId', data, this.userNotifications);
            },
            error: (err) => {
                this.toastr.error('Failed to get notifications');
                console.error('getAllNotificationsByUserId err', err);
            },
        })
    }

    openNotificationDetails(notification: NotificationModel) {
        this.selectedNotification = notification;
        this.modalService.openNotificationDetailsModal();
    }

    readAllNotifications() {
        if (!this.authStateService.currentUser) {
            return;
        }

        this.notificationsApiService.readAllNotifications(this.authStateService.currentUser.id).subscribe({
            next: (data) => {
                for (let index = 0; index < this.userNotifications.length; index++) {
                    const element = this.userNotifications[index];
                    element.is_read = true;
                }

                this.unreadNotificationsCount = data?.unreadNotificationsCount || null;
                this.isReadAllDisabled = true;
                // console.log('readAllNotifications', data, this.userNotifications);
            },
            error: (err) => {
                // Move toggle state back to previous
                this.isReadAllChecked = !this.isReadAllChecked;
                this.toastr.error('Failed to read notifications');
                console.error('readAllNotifications err', err);
            },
        })
    }
}
