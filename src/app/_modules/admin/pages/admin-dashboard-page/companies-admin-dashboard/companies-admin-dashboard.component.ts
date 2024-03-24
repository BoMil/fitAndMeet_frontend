import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/_models/company';
import { CompanyApiService } from 'src/app/_services/api-services/company-api.service';

export enum CompanyContent { TableView, EditCompanyView, CreateCompanyView }
@Component({
  selector: 'app-companies-admin-dashboard',
  templateUrl: './companies-admin-dashboard.component.html',
  styleUrls: ['./companies-admin-dashboard.component.scss']
})
export class CompaniesAdminDashboardComponent {
    allCompanies: Company[] = [];
    view = CompanyContent;
    currentView: CompanyContent = CompanyContent.TableView;
    companyToEdit: Company | null = null;

    constructor(
        private companyApiService: CompanyApiService,
        private toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.getAllCompanies();
    }

    editCompany(company: Company) {
        this.companyToEdit = company;
        this.currentView = CompanyContent.EditCompanyView;
        // console.log('editCompany', company)
    }

    deleteCompany(company: Company) {
        // console.log('deleteCompany', company)
        this.companyApiService.removeCompany(company.id).subscribe({
            next: (data) => {
                this.toastr.success('Company removed');
                this.getAllCompanies();
            },
            error: (err) => {
                this.toastr.error('Failed to delete company');
                console.log('deleteCompany', err);
            }
        }); 
    }

    onCompanyCreatedOrUpdated() {
        this.currentView = CompanyContent.TableView;
        this.companyToEdit = null;
        this.getAllCompanies();
    }

    getAllCompanies() {
        this.companyApiService.getAllCompanies(null).subscribe({
            next: (data) => {
                this.allCompanies = [];
                for (let index = 0; index < data.length; index++) {
                    const company: Company = new Company(data[index]);
                    this.allCompanies.push(company);
                }
            },
            error: (err) => {
                this.toastr.error('Failed to get all companies');
                console.log('getAllCompanies', err);
            }
        }); 
    }
}
