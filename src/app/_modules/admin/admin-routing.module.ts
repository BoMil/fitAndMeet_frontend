import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandingPageComponent } from './pages/admin-landing-page/admin-landing-page.component';
import { adminDashboarGuard } from './_guards/admin-dashboard.guard';
import { AdminLoginPageComponent } from './pages/admin-login-page/admin-login-page.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { adminGuard } from './_guards/admin.guard';
import { UsersAdminDashboardComponent } from './pages/admin-dashboard-page/users-admin-dashboard/users-admin-dashboard.component';
import { CompaniesAdminDashboardComponent } from './pages/admin-dashboard-page/companies-admin-dashboard/companies-admin-dashboard.component';

const routes: Routes = [
    // Redirect to login page by default
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
		path: '',
		component: AdminLandingPageComponent,
	},
    {
		path: 'login',
        canActivate: [adminGuard],
		component: AdminLoginPageComponent,
        title: 'Admin login',
	},
    {
		path: 'dashboard',
        canActivate: [adminDashboarGuard],
        // loadComponent: () => import('./admin-login/admin-login.component').then((c) => c.AdminLoginComponent),
		component: AdminDashboardPageComponent,
        title: 'Admin dashboard',
        children: [
            { path: '', redirectTo: 'companies', pathMatch: 'full' },
            {
                path: 'companies',
                canActivate: [adminDashboarGuard],
                component: CompaniesAdminDashboardComponent,
                title: 'Admin dashboard | Companies',
            },
            {
                path: 'users',
                canActivate: [adminDashboarGuard],
                component: UsersAdminDashboardComponent,
                title: 'Admin dashboard | Users',
            },
        ]
	},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
