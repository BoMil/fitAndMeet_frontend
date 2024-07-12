import { NotificationType } from "../_enums/notification-type";

export class NotificationModel {
    id?: number;
    userId: number; // the user who receives the notification
    notificationTriggerUserId?: number; // the user who invokes the action that trigger creating the notification (user who send follow request)
    created_at: string;
    notificationType: string;
    title: string;
    content: string;
    is_read: boolean;
    eventId?: number;
    entityImage: string;

    constructor(data?: any) {
        this.id = data?.id || 0;
        this.userId = data?.userId || 0;
        this.notificationTriggerUserId = data?.notificationTriggerUserId;
        this.created_at = data?.created_at || '';
        this.notificationType = data?.notificationType || '';
        this.is_read = data?.is_read || false;
        this.title = data?.title ? data.title : this.setTitle(this.notificationType);
        this.content = data?.content || '';
        this.eventId = data?.eventId;
        this.entityImage = data?.entityImage || '';
    }

    setTitle(type: string): string {
        switch (type) {
            case NotificationType.FOLLOW_REQUEST_PENDING:
                return 'Follow request';
            case NotificationType.FOLLOW_REQUEST_ACCEPTED:
                return'Follow request accepted';
            case NotificationType.FOLLOW_REQUEST_DECLINED:
                return'Follow request declined';
            case NotificationType.EVENT_REQUEST_ACCEPTED:
                return'Event request accepted';
            case NotificationType.EVENT_REQUEST_DECLINED:
                return'Event request declined';
            case NotificationType.EVENT_REQUEST_PENDING:
                return'Event request pending';
            default:
                return'New Notification';
        }
    }
}