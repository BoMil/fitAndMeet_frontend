import { Injectable } from '@angular/core';
import { GetAllFollowedBuRequest } from 'src/app/_interfaces/get-all-followed-bu-request';
import { EventModel } from 'src/app/_models/event';
import { User } from 'src/app/_models/user';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { EventsApiService } from 'src/app/_services/events/events-api.service';
import { StateTypes } from 'src/app/_types/state-types';
import { HelperService } from 'src/app/common/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class BuDashboardStateService {
    currentDashboardBusinessUser!: User | null;
    allDashboardBusinessUsers: User[] = []
    mainState: StateTypes = 'LOADING';

    // Events
	allEvents: EventModel[] = [];
	selectedDayEvents: EventModel[] = [];

    constructor(
        private userService: UserApiService,
		private eventsApiService: EventsApiService,
        private helperService: HelperService,
    ) { }

    fetchBusinesUserById(id: number) {
        this.mainState = 'LOADING';
        this.userService.getBusinessUserById(id).subscribe(
            (data) => {
                this.mainState = 'LOADED';
                this.currentDashboardBusinessUser = new User(data[0]); // TODO: Should change 
            },
            (error) => {
                this.mainState = 'ERROR';
            }
        );
    }

    fetchAllFollowedBusinessUsers(id: number) {
        const request: GetAllFollowedBuRequest = {
            followerUserId: id
        };
        this.allDashboardBusinessUsers = [];
        this.mainState = 'LOADING';

        this.userService.getAllFollowedBusinessUsers(request).subscribe(
            (data) => {
   
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let user: User = new User(element);
                this.allDashboardBusinessUsers.push(user);
                // this.allDashboardBusinessUsers.push(user);
            }
            this.currentDashboardBusinessUser = this.allDashboardBusinessUsers.length ? this.allDashboardBusinessUsers[0] : null;
            this.mainState = 'LOADED';
        },
        (error) => {
            this.mainState = 'ERROR';
        }); 
    }
}
