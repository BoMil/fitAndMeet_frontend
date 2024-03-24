import { Component, OnInit } from '@angular/core';
import { ModalService } from './_services/modal.service';
import { MapService } from './_services/map.service';
import { CompaniesStateService } from './_global-state-services/company/companies-state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(
        public modalService: ModalService,
        private mapService: MapService,
        private companiesStateService: CompaniesStateService,
    ) {}

	ngOnInit(): void {
        // First check if the user opens a admin app
        if (window.location.href.includes('/admin/')) {
            return;
        }

        this.companiesStateService.getAllCompanies();
        this.mapService.initializeGoogleMaps();
	}
}
