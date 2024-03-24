import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { FollowRequest } from 'src/app/_interfaces/follow-request';
import { InfoBoxData } from 'src/app/_models/info-box-data';
import { FollowApiService } from 'src/app/_services/api-services/follow-api.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent {
    @Input() itemIndex: number = 0;
    @Input() selectedIndex: number = 0;
    @Input() data!: InfoBoxData;

    constructor(
        private router: Router,
        private toastr: ToastrService,
        public authStateService: AuthStateService,
        private followApiService: FollowApiService
        ) {}


    redirectToUserDashboard() {
        this.router.navigateByUrl(`/business-user-dashboard/${this.data.userId}`);
    }

    followBusinessUser() {
        if (!this.authStateService.currentUser?.id || !this.data.userId) {
            return;
        }

        const request: FollowRequest = {
            followerUserId: this.authStateService.currentUser?.id,
            userToFollowId: this.data.userId
        };

        this.followApiService.followBusinessUser(request).subscribe({
            next: (data) => {
                console.log('followBusinessUser', data);
            },
            error: (err) => {
                this.toastr.error('Failed to follow');
                console.log('followBusinessUser', err);
            }
          });   
    }

}
