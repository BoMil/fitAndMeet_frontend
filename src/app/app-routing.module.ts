import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { BusinessUserDashboardPageComponent } from './components/pages/business-user-dashboard-page/business-user-dashboard-page.component';
import { homePageGuard } from './_route_guards/home-page.guard';
import { businessDashboardGuard } from './_route_guards/business-dashboard.guard';
import { SchedulingPageComponent } from './components/pages/scheduling-page/scheduling-page.component';
import { schedulePageGuard } from './_route_guards/schedule-page.guard';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';

// TODO: Add a lazy loaded routes for business users views
const routes: Routes = [

    // Public layout
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                component: HomePageComponent,
                title: 'Home Page',
                canActivate: [homePageGuard],
            },
            {
                path: 'business-user-dashboard/:id',
                canActivate: [businessDashboardGuard],
                component: BusinessUserDashboardPageComponent,
                title: 'Fitness instructor dashboard'
            },
            {
                path: 'scheduling',
                component: SchedulingPageComponent,
                title: 'Schedule Page',
                canActivate: [schedulePageGuard],
            },
        ]
    },

    // Admin dashboard app (lazy-loaded)
    {
        path: 'admin',
        loadChildren: () => import('./_modules/admin/admin.module').then((m) => m.AdminModule),
    },

    // Redirect to home page by default even if the route is invalid
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
    // providers: [
    //     provideRouter(routes, withViewTransitions()),
    // ]
})
export class AppRoutingModule {}
