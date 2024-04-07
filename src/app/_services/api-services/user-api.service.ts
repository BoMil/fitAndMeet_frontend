import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { CreateOrUpadateUserRequest } from '../../_interfaces/register-request';
import { GetAllUsersByCompanyRequest } from 'src/app/_interfaces/get-all-users-by-company-request';
import { GetEndUserDetailsRequest } from 'src/app/_interfaces/get-end-user-details-request';
import { GetAllFollowedBuRequest } from 'src/app/_interfaces/get-all-followed-bu-request';
import { AppConfig } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
    private userApiUrl = this.config.setting['pathApi'] + 'user';

    constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) { }

    getAllBusinessUsers() {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getAllBusinessUsers`, null);
    }

    getBusinessUserById(id: number) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getUserById`, { userId: id });
    }

    registerUser(request: CreateOrUpadateUserRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/create`, request);
    }

    getAllBusinessUsersByCompanyId(request: GetAllUsersByCompanyRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getAllBusinessUsersByCompanyId`, request);
    }

    getEndUserDetails(request: GetEndUserDetailsRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getEndUserDetails`, request);
    }

    getAllFollowedBusinessUsers(request: GetAllFollowedBuRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/getAllFollowedBusinessUsers`, request);
    }

    getAllUsers() {
        return this.requestHandlerService.sendGetRequest(`${this.userApiUrl}/getAllUsers`, null);
    }

    updateUser(request: CreateOrUpadateUserRequest, id: number) {
        return this.requestHandlerService.sendPatchRequest(`${this.userApiUrl}/${id}`, request);
    }

    removeUser(id: number) {
        return this.requestHandlerService.sendDeleteRequest(`${this.userApiUrl}/${id}`);
    }
}
