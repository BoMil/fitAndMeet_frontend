import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Angular material modules
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalComponent } from './common/modal/modal.component';
import { EventFormComponent } from './common/modal/event-form/event-form.component';
import { ClickOutsideDirective } from './_directives/click-outside.directive';
import { HeaderNavigationComponent } from './components/header-navigation/header-navigation.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/pages/home-page/home-page.component';

import { CustomCarouselComponent } from './common/custom-carousel/custom-carousel.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import {LayoutModule} from '@angular/cdk/layout';
import { EventsLegendComponent } from './components/pages/business-user-dashboard-page/events-legend/events-legend.component';
import { HttpInterceptorService } from './_helpers/interceptor';
import { RegularTabsComponent } from './components/regular-tabs/regular-tabs.component';
import { CompanyInfoBoxComponent } from './components/company-info-box/company-info-box.component';
import { BusinessUserDashboardPageComponent } from './components/pages/business-user-dashboard-page/business-user-dashboard-page.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NotificationsListComponent } from './components/notifications/notifications-list/notifications-list.component';
import { NotificationIconComponent } from './components/notifications/notification-icon/notification-icon.component';
import { NotificationCardComponent } from './components/notifications/notification-card/notification-card.component';
import { NotificationDetailsComponent } from './components/notifications/notification-details/notification-details.component';
import { BusinessUserInfoTabComponent } from './components/pages/business-user-dashboard-page/business-user-info-tab/business-user-info-tab.component';
import { BusinessUserScheduleTabComponent } from './components/pages/business-user-dashboard-page/business-user-schedule-tab/business-user-schedule-tab.component';
import { MyCoachesPageComponent } from './components/pages/scheduling-page/my-coaches-page.component';
import { SharedModule } from './_modules/shared/shared.module';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { AppConfig } from './config/config';
import { CoachInfoBoxComponent } from './components/coach-info-box/coach-info-box.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { FullCalendarModule } from '@fullcalendar/angular';

const appConfig = new AppConfig();
// const config: SocketIoConfig = { url: appConfig.setting['pathApi'], options: {} };

@NgModule({
	declarations: [
		AppComponent,
		SignInComponent,
		ModalComponent,
		EventFormComponent,
		ClickOutsideDirective,
		HeaderNavigationComponent,
        HomePageComponent,
        CustomCarouselComponent,
        InfoBoxComponent,
        EventsLegendComponent,
        RegularTabsComponent,
        CompanyInfoBoxComponent,
        BusinessUserDashboardPageComponent,
        NotificationsListComponent,
        NotificationIconComponent,
        NotificationCardComponent,
        NotificationDetailsComponent,
        BusinessUserInfoTabComponent,
        BusinessUserScheduleTabComponent,
        MyCoachesPageComponent,
        PublicLayoutComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatMenuModule,
        LayoutModule,
        // SocketIoModule.forRoot(config),
        MatBadgeModule,
        SharedModule,
        FullCalendarModule,
        SideNavigationComponent,
        // Standalone components
        CoachInfoBoxComponent,
	],
    providers: [
        AppConfig,
        provideAnimations(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
          },
    ],
	bootstrap: [AppComponent],
})
export class AppModule {}
