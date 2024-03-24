import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { FindByUserIdRequest } from 'src/app/_interfaces/find-by-user-id-request';
import { AppConfig } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApiService {
    private userApiUrl = this.config.setting['pathApi'] + 'notification';

    constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) { }

    getAllNotificationsByUserId(request: FindByUserIdRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getAllNotificationsByUserId`, request);
    }

    readAllNotifications(userId: number) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/readAllNotificationsByUserId`, { userId: userId });
    }
}
