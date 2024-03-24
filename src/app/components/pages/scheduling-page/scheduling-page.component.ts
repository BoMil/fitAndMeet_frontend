import { Component } from '@angular/core';
import { BuDashboardStateService } from 'src/app/_global-state-services/bu-dashboard/bu-dashboard-state.service';

@Component({
  selector: 'app-scheduling-page',
  templateUrl: './scheduling-page.component.html',
})
export class SchedulingPageComponent {

    constructor(
        public buDashboardStateService: BuDashboardStateService,
    ) {}
}
