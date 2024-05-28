import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/_models/company';
import { CompanyApiService } from 'src/app/_services/api-services/company-api.service';
import { AuthStateService } from '../auth/auth-state.service';
import { IEntitiesInAreaRequest } from '../../_interfaces/entitties-in-area-request';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
    public companies: Company[] = [];
    public companiesInArea: Company[] = [];
    public selectedCompany: Company | null = null;

    constructor(
        private companyApiService: CompanyApiService,
        private toastr: ToastrService,
        private authStateService: AuthStateService
    ) { }

    getAllCompanies() {
        this.companyApiService.getAllCompanies(this.authStateService.currentUser?.id ?? null).subscribe({
            next: (data) => {
                this.companies = [];

                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    const company = new Company(element);
                    this.companies.push(company);
                }
                // console.log('getAllCompanies', this.companies);

            },
            error: (err) => {
                this.toastr.error('Failed to get companies');
                console.log('getAllCompanies', err);
            }
        });   
    }

    filterCompaniesInArea(coordinates: IEntitiesInAreaRequest | null) {
        if (!coordinates) {
            return;
        }

        this.companiesInArea = [];

        for (let index = 0; index < this.companies.length; index++) {
            const element = this.companies[index];

            if (!element.location?.lat || !element.location?.long) {
                continue;
            }

            const isLatEqual: boolean = element.location.lat >= coordinates.bottomRightLat && element.location?.lat <= coordinates.topLeftLat;
            const isLongEqual: boolean = element.location.long <= coordinates.bottomRightLong && element.location?.long >= coordinates.topLeftLong;

            if (isLatEqual && isLongEqual) {
                this.companiesInArea.push(element);
            }
        }
        // console.log('companiesInArea', this.companiesInArea);
    }

    removeCompaniesFollowStatus() {
        for (let index = 0; index < this.companies.length; index++) {
            const company: Company = this.companies[index];
            company.followingStatus = null;
        }
    }
}
