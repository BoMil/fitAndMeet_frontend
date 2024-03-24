import { Component } from '@angular/core';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
	selector: 'app-header-navigation',
	templateUrl: './header-navigation.component.html',
	styleUrls: ['./header-navigation.component.scss'],
})
export class HeaderNavigationComponent {
	constructor(
        public authStateService: AuthStateService,
        private modalService: ModalService,
        private notificationsStateService: NotificationsStateService,
    ) {}

	signInClicked() {
        this.modalService.openSignInModal();
	}

    logoutClicked() {
        this.authStateService.logoutUser();
        this.notificationsStateService.closeNotificationsListSidenav();
    }
}
