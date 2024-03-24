import { Component, OnInit } from '@angular/core';
import { AdminAuthStateService } from '../../_global_state_services/auth/admin-auth-state.service';
import { AdminSidenavItem } from '../../_enums/admin-sidenav-item';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.scss']
})
export class AdminDashboardPageComponent implements OnInit {
    sideNavItem = AdminSidenavItem;
    selectedSidenavItem: AdminSidenavItem = AdminSidenavItem.Companies;

    constructor(
		public adminAuthStateService: AdminAuthStateService,
    ) {}

    ngOnInit(): void {
        this.preselectNavitem();
    }

    logout() {
        this.adminAuthStateService.logoutUser();
    }

    preselectNavitem() {
        if (window.location.href.includes('dashboard/users')) {
            this.selectedSidenavItem = AdminSidenavItem.Users;
        } else {
            this.selectedSidenavItem = AdminSidenavItem.Companies;
        }
    }

    selectNavitem(item: AdminSidenavItem) {
        this.selectedSidenavItem = item;
    }
}
