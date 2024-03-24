import { NotificationType } from "../_enums/notification-type";

export class NotificationModel {
    id?: number;
    userId: number;
    followerUserId?: number;
    created_at: string;
    notificationType: string;
    title: string;
    content: string;
    is_read: boolean;

    constructor(data?: any) {
        this.id = data?.id || 0;
        this.userId = data?.userId || 0;
        this.followerUserId = data?.followerUserId || 0;
        this.created_at = data?.created_at || '';
        this.notificationType = data?.notificationType || '';
        this.is_read = data?.is_read || false;
        this.title = data?.title || '';
        this.content = data?.content || '';
    }
}