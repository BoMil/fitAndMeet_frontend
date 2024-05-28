import { Component, OnInit } from '@angular/core';
import { ModalService } from './_services/modal.service';
import { MapService } from './_services/map.service';
import { CompaniesStateService } from './_global-state-services/company/companies-state.service';
import { BuStateService } from './_global-state-services/business-user/bu-state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(
        public modalService: ModalService,
        private mapService: MapService,
        private companiesStateService: CompaniesStateService,
        private businessUsersStateService: BuStateService,
    ) {}

	ngOnInit(): void {
        // First check if the user opens a admin app
        if (window.location.href.includes('/admin/')) {
            return;
        }

        this.companiesStateService.getAllCompanies();
        this.businessUsersStateService.getAllBusinessUsers();
        this.mapService.initializeGoogleMaps();
	}
}
