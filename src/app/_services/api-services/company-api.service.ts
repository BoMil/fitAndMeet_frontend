import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../request-handler.service';
import { ICompaniesInAreaRequest } from '../../_interfaces/companies-in-area-request';
import { CreateCompanyRequest } from 'src/app/_interfaces/create-company-request';
import { AppConfig } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {
    private userApiUrl = this.config.setting['pathApi'] + 'company';

    constructor(private requestHandlerService: RequestHandlerService, private config: AppConfig) { }

    getAllCompaniesInArea(request: ICompaniesInAreaRequest) {
        return this.requestHandlerService.sendGetRequest(`${this.userApiUrl}/within-area?topLeftLat=${request.topLeftLat}&topLeftLong=${request.topLeftLong}&bottomRightLat=${request.bottomRightLat}&bottomRightLong=${request.bottomRightLong}`, null);
    }

    getAllCompanies(userId: number | null) {

        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}`, { userId: userId });
    }

    createCompany(request: CreateCompanyRequest) {
        return this.requestHandlerService.sendPostRequest(`${this.userApiUrl}/create`, request);
    }

    removeCompany(companyId: number) {
        return this.requestHandlerService.sendDeleteRequest(`${this.userApiUrl}/${companyId}`);
    }

    updateCompany(request: CreateCompanyRequest, id: number) {
        return this.requestHandlerService.sendPatchRequest(`${this.userApiUrl}/${id}`, request);
    }
}
