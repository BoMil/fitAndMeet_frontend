import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { LoginRequest } from '../../_interfaces/login-request';
import { AppConfig } from '../../config/config';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService {
    private userApiUrl = this.config.setting['pathApi'] + 'auth';

    constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) { }


	loginUser(loginRequest: LoginRequest) {
		return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/login`, loginRequest);
	}

    loginAdminUser(loginRequest: LoginRequest) {
		return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/adminLogin`, loginRequest);
	}
}
