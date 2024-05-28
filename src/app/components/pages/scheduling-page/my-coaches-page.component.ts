import { Component } from '@angular/core';
import { BuDashboardStateService } from 'src/app/_global-state-services/bu-dashboard/bu-dashboard-state.service';

@Component({
  selector: 'my-coaches-page',
  templateUrl: './my-coaches-page.component.html',
})
export class MyCoachesPageComponent {

    constructor(
        public buDashboardStateService: BuDashboardStateService,
    ) {}
}
