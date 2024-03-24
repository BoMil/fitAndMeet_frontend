import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminLandingPageComponent } from './pages/admin-landing-page/admin-landing-page.component';
import { AdminLoginPageComponent } from './pages/admin-login-page/admin-login-page.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { UsersAdminDashboardComponent } from './pages/admin-dashboard-page/users-admin-dashboard/users-admin-dashboard.component';
import { CompaniesAdminDashboardComponent } from './pages/admin-dashboard-page/companies-admin-dashboard/companies-admin-dashboard.component';
import { CompanyDetailsFormComponent } from './pages/admin-dashboard-page/companies-admin-dashboard/company-details-form/company-details-form.component';
import { UserDetailsFormComponent } from './pages/admin-dashboard-page/users-admin-dashboard/user-details-form/user-details-form.component';


@NgModule({
  declarations: [
    AdminLandingPageComponent,
    AdminLoginPageComponent,
    AdminDashboardPageComponent,
    UsersAdminDashboardComponent,
    CompaniesAdminDashboardComponent,
    CompanyDetailsFormComponent,
    UserDetailsFormComponent,
    
  ],
  imports: [
    // CommonModule,
    SharedModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
