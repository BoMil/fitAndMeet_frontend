import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from 'src/app/_enums/auth';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { BuDashboardStateService } from 'src/app/_global-state-services/bu-dashboard/bu-dashboard-state.service';
import { RegularTab } from 'src/app/_interfaces/regular-tab';

@Component({
  selector: 'app-business-user-dashboard-page',
  templateUrl: './business-user-dashboard-page.component.html',
  styleUrls: ['./business-user-dashboard-page.component.scss', '../../../../../node_modules/keen-slider/keen-slider.min.css']
})
export class BusinessUserDashboardPageComponent implements OnInit, OnDestroy, AfterViewInit {
	ngUnsubscribe = new Subject();
    tabs: RegularTab[] = [
        {
            name: 'Info',
            selected: false
        },
        {
            name: 'Scheduling',
            selected: true
        }
    ];
    selectedTab: RegularTab = this.tabs[1];

    @Input() isMultiUserPage: boolean = false;
    @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>;

    currentSlide: number = 1
    dotHelper: Array<Number> = []
    slider: KeenSliderInstance | null= null;

    constructor(
        public authStateService: AuthStateService,
        public buDashboardStateService: BuDashboardStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toaster: ToastrService
    ) {}

    ngOnInit(): void {
        this.listenIfUserLogout();
        // this.getBusinessUserByIdFromUrl();

        if (this.isMultiUserPage) {
            // In the dashboard state service get all busines users (coaches) that current user follow
            // 1. If they don't exists display some no following coaches
            // 2. If they exists store them in a list followingUsers and set currentDashboardBusinessUser to be first from the list
            //     In this page make a carousel 
            this.getAllFollowedBusinessUsers();
        } else {
            this.getBusinessUserByIdFromUrl();
        }
    }

    ngAfterViewInit(): void {
        if (!this.isMultiUserPage) {
            return;
        }

        setTimeout(() => {
            this.slider = new KeenSlider(this.sliderRef?.nativeElement, {
              initial: this.currentSlide,
              slideChanged: (s: KeenSliderInstance) => {
                console.log('Slide changed', s);
                this.currentSlide = s.track.details.rel;
                this.buDashboardStateService.currentDashboardBusinessUser = this.buDashboardStateService.allDashboardBusinessUsers[this.currentSlide];
                console.log('Current user', this.buDashboardStateService.currentDashboardBusinessUser);
              },
            });

            console.log('Slide INIT', this.slider);
            this.dotHelper = []
            for (let index = 0; index < this.buDashboardStateService.allDashboardBusinessUsers.length; index++) {
                this.dotHelper.push(index);
            }
          }, 500);
    }

    ngOnDestroy(): void {
        if (this.slider) {
            this.slider.destroy();
        }
        this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
    }

    listenIfUserLogout() {
        // Listen when the user logout and redirect him to home page
        this.authStateService.authStateChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (state: Auth) => {
                    if (state === Auth.UNAUTHENTICATED) {
                        this.router.navigateByUrl('');
                    }
                }
            }
        );
    }

    getBusinessUserByIdFromUrl() {
        const userId = this.activatedRoute.snapshot.paramMap.get("id");

        if (!userId) {
           this.toaster.error('User id is missing');
           return;
        }
        this.buDashboardStateService.fetchBusinesUserById(Number(userId));
        // this.buDashboardStateService.fetchBusinesUserEvents(Number(userId));
    }
    
    tabSelected(selectedTab: RegularTab) {
        this.selectedTab = selectedTab;
    }

    getAllFollowedBusinessUsers() {
        if (!this.authStateService.currentUser) {
            return;
        }
        this.buDashboardStateService.fetchAllFollowedBusinessUsers(this.authStateService.currentUser.id);
    }
}
