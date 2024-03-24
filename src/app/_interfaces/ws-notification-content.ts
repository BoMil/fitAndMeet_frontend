import { NotificationType } from "../_enums/notification-type";

export interface WSNotificationContent { 
    type: NotificationType;
    unreadNotificationsCount?: number;
}