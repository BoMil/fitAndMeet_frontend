import { Component } from '@angular/core';
import { BuDashboardStateService } from 'src/app/_global-state-services/bu-dashboard/bu-dashboard-state.service';

@Component({
  selector: 'app-business-user-info-tab',
  templateUrl: './business-user-info-tab.component.html',
  styleUrls: ['./business-user-info-tab.component.scss']
})
export class BusinessUserInfoTabComponent {

    constructor(
        public buDashboardStateService: BuDashboardStateService,
    ) {}
}
