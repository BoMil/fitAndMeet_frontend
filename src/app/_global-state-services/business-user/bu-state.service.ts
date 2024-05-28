import { Injectable } from '@angular/core';
import { User } from '../../_models/user';
import { UserApiService } from '../../_services/api-services/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { IEntitiesInAreaRequest } from '../../_interfaces/entitties-in-area-request';

@Injectable({
  providedIn: 'root'
})
export class BuStateService {
    public businessUsers: User[] = [];
    public businessUsersInArea: User[] = [];

    /**
     * Helper flag used to determine if the user fetch has failed. If so, next time the user
     * move the map we will trigger fetch again
     */
    public usersFetchSucceeded: boolean = false; // TODO: Use this mechanism

    constructor(
        private userApiService: UserApiService, 
        private toastr: ToastrService,
    ) { }

    getAllBusinessUsers() {
        this.userApiService.getAllBusinessUsers().subscribe({
            next: (data) => {
                this.usersFetchSucceeded = true;
                this.businessUsers = [];

                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    const user = new User(element);
                    this.businessUsers.push(user);
                }
                // console.log('getAllCompanies', this.companies);
            },
            error: (err) => {
                this.usersFetchSucceeded = false;
                this.toastr.error('Failed to get users');
                console.log('getAllUsers', err);
            }
        }); 
    }

    filterBusinessUsersInArea(coordinates: IEntitiesInAreaRequest | null) {
        if (!coordinates) {
            return;
        }

        this.businessUsersInArea = [];

        for (let index = 0; index < this.businessUsers.length; index++) {
            const element = this.businessUsers[index];

            if (!element?.lat || !element?.long) {
                continue;
            }

            const isLatEqual: boolean = element.lat >= coordinates.bottomRightLat && element?.lat <= coordinates.topLeftLat;
            const isLongEqual: boolean = element.long <= coordinates.bottomRightLong && element?.long >= coordinates.topLeftLong;

            if (isLatEqual && isLongEqual) {
                this.businessUsersInArea.push(element);
            }
        }
        // console.log('businessUsersInArea', this.businessUsersInArea);
    }
}
