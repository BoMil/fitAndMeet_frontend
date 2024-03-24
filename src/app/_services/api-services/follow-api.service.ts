import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { FollowRequest } from '../../_interfaces/follow-request';
import { AppConfig } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class FollowApiService {
    private userApiUrl = this.config.setting['pathApi'] + 'followings';

	constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) {}

	followBusinessUser(followRequest: FollowRequest) {
		return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/user/${followRequest.followerUserId}/${followRequest.userToFollowId}`, null);
	}

    acceptFollowRequest(request: FollowRequest) {
		return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/acceptFollowRequest`, request);
	}

    declineFollowRequest(request: FollowRequest) {
		return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/declineFollowRequest`, request);
	}
}
