import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from 'src/app/_enums/auth';
import { RoleEnum } from 'src/app/_enums/user-role';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { ICompaniesInAreaRequest } from 'src/app/_interfaces/companies-in-area-request';
import { RegularTab } from 'src/app/_interfaces/regular-tab';
import { Company } from 'src/app/_models/company';
import { InfoBoxData } from 'src/app/_models/info-box-data';
import { User } from 'src/app/_models/user';
import { MapService } from 'src/app/_services/map.service';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { GetAllUsersByCompanyRequest } from 'src/app/_interfaces/get-all-users-by-company-request';
import { FollowingStatus } from 'src/app/_enums/following-status';
import { NotificationsStateService } from 'src/app/_global-state-services/notifications/notifications-state.service';
import { WSNotificationContent } from 'src/app/_interfaces/ws-notification-content';
import { NotificationType } from 'src/app/_enums/notification-type';
import { CompaniesStateService } from 'src/app/_global-state-services/company/companies-state.service';
import { CollapseItem } from 'src/app/_modules/shared/_interfaces/collapse-item';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    carouselItems: InfoBoxData[] = [];
	ngUnsubscribe = new Subject();
	ngUnsubscribeNotifications = new Subject();
    mapBoundsTimeout: any;
    // Map references
    @ViewChild('desktopMap', {static:false}) desktopMap! : google.maps.Map;
    @ViewChild('mobileMap', {static:false}) mobileMap! : google.maps.Map;
    @ViewChildren(MapInfoWindow) infoWindowsView!: QueryList<MapInfoWindow>;
    markerOptions: google.maps.MarkerOptions = {
        clickable: true,
        icon: {
            url: '../../../../assets/svg/custom_map_marker.svg',
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(30, 30)
        },
        // label: 'Some label',
        // title: 'Some title',
        // animation: google.maps.Animation.DROP
    };

    followedMarkerOptions: google.maps.MarkerOptions = {
        clickable: true,
        icon: {
            url: '../../../../assets/svg/custom_map_marker_following.svg',
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(30, 30)
        }
    };

    tabs: RegularTab[] = [
        {
            name: 'Company',
            selected: true
        },
        {
            name: 'Coaches',
            selected: false
        }
    ];

    selectedTab: RegularTab = this.tabs[0];
    selectedSection: CollapseItem | null = null;
    followStatus = FollowingStatus;

 	constructor(
        private userApiService: UserApiService,
        public mapService: MapService,
        public authStateService: AuthStateService,
        private breakpointObserver: BreakpointObserver,
        private toastr: ToastrService,
        private router: Router,
        public notificationStateService: NotificationsStateService,
        public companiesStateService: CompaniesStateService,
    ) {}

    ngOnInit(): void {
        this.userApiService.getAllUsers().subscribe({
            next: (data) => {
                // this.allUsers = [];
                for (let index = 0; index < data.length; index++) {
                    const user: User = new User(data[index]);
                    // this.allUsers.push(user);
                }
                console.log('getAllUsers', data);

            },
            error: (err) => {
                this.toastr.error('Failed to get all users');
                console.log('getAllUsers', err);
            }
        });
        this.zoomMapToCalculatedCoordinates();
        this.listenAuthStateChanges();
        this.listenWhenUserNotificationsArrived();
    }

	ngOnDestroy() {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
        this.unsubscribeFromNotifications();
	}

    zoomMapToUserCoordinates() {
        let user: User | null = this.authStateService.getUserFromLocalStorage();
        if (user && user.lat && user.long) {
            // Zoom map to the user location
            this.mapService.center = { lat: user.lat, lng: user.long };
        } else {
            this.mapService.center = this.mapService.defaultCenter;
        }
    }

    async zoomMapToCalculatedCoordinates() {
        const position: google.maps.LatLngLiteral | null = await this.mapService.getCurrentLocation();
        // First check if user allowed getting browser location
        if (position) {
            this.mapService.center = { lat: position.lat, lng: position.lng };
        } else {
            // If not zoom to current user address
            this.zoomMapToUserCoordinates();
        }
    }

    onMapBoundsChanged() {
        if (this.mapBoundsTimeout) {
            clearTimeout(this.mapBoundsTimeout);
        }
        this.mapBoundsTimeout = setTimeout(() => {
            // console.log('onMapBoundsChanged', this.getMapCoordinates());
            this.mapBoundsTimeout = null;
            this.companiesStateService.filterCompaniesInArea(this.getMapCoordinates());

            const selectedCompanyIndex = this.companiesStateService.companiesInArea.findIndex((el: Company) => el.id === this.companiesStateService.selectedCompany?.id);

            if (selectedCompanyIndex === -1) {
                this.carouselItems = [];
                this.companiesStateService.selectedCompany = null;
            }
        }, 800);
    }

    onMapInitialized(event: google.maps.Map, type: 'desktop' | 'mobile' = 'desktop') {
        const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 991px)');
        if (isSmallScreen && type === 'mobile') {
            // this.getAllCompanies();  
        }

        if (!isSmallScreen && type === 'desktop') {
            // this.getAllCompanies();  
        }
    }

    listenAuthStateChanges() {
        // Listen when user login/logout
        this.authStateService.authStateChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (state: Auth) => {
                    // Navigate business user to his dashboard
                    if (this.authStateService.currentUser?.role === RoleEnum.BUSINESS_USER) {
                        this.router.navigateByUrl(`/business-user-dashboard/${this.authStateService.currentUser?.id}`);
                        return;
                    }

                    if (state === Auth.AUTHENTICATED) {
                        this.zoomMapToCalculatedCoordinates();
                        this.listenWhenUserNotificationsArrived();
                        // Fetch companies to see their following status on the map
                        this.companiesStateService.getAllCompanies();
                        return;
                    } else {
                        this.unsubscribeFromNotifications();
                        // On logout remove companies follow status
                        this.companiesStateService.removeCompaniesFollowStatus();
                    }
                }
            }
        );
    }

    getMapCoordinates(): ICompaniesInAreaRequest | null {
        const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 991px)');
        const bounds: google.maps.LatLngBounds | undefined = isSmallScreen ? this.mobileMap?.getBounds() : this.desktopMap?.getBounds();
        if (!bounds) {
            return null;
        }
        let northEast: google.maps.LatLng = bounds.getNorthEast();
        let southWest: google.maps.LatLng = bounds.getSouthWest();
        let northWest: google.maps.LatLng = new google.maps.LatLng(northEast.lat(), southWest.lng());
        let southEast: google.maps.LatLng = new google.maps.LatLng(southWest.lat(), northEast.lng());

        return {
            bottomRightLat: southEast.lat(),
            bottomRightLong: southEast.lng(),
            topLeftLat: northWest.lat(),
            topLeftLong: northWest.lng(),
        }

        // console.log('getAllCoachesByCoordinates northEast', northEast.lat(), northEast.lng() );
        // console.log('getAllCoachesByCoordinates southEast', southEast.lat(), southEast.lng() );
        // console.log('getAllCoachesByCoordinates southWest', southWest.lat(), southWest.lng() );
        // console.log('getAllCoachesByCoordinates northWest', northWest.lat(), northWest.lng() );
    }

    companySelectedOnMap(marker: MapMarker, windowIndex: number, company: Company) {
        const sectionItem: CollapseItem = {
            isOpened: true,
            id: company.id,
            data: company
        }

        this.onCompanySectionToggled(sectionItem);

        /// stores the current index in forEach
        let curIdx = 0;
        this.infoWindowsView.forEach((window: MapInfoWindow) => {
            if (windowIndex === curIdx) {
                window.open(marker);
                curIdx++;
            } else {
                window.close();
                curIdx++;
            }
        });
    }

    tabSelected(selectedTab: RegularTab) {
        this.selectedTab = selectedTab;
    }

    getAllBusinessUsersByCompanyId() {
        if(!this.companiesStateService.selectedCompany) {
            return;
        }
        const request: GetAllUsersByCompanyRequest = {
            companyId: this.companiesStateService.selectedCompany.id,
            endUserId: this.authStateService.currentUser?.id || null
        }

        this.carouselItems = [];

        this.userApiService.getAllBusinessUsersByCompanyId(request).subscribe({
            next: (data) => {
                for (let index = 0; index < data.length; index++) {
                    const user: User = new User(data[index]);

                    const carouselItem: InfoBoxData = new InfoBoxData({
                        review: user.review,
                        name: user.first_name,
                        lastName: user.last_name,
                        userName: user.user_name,
                        avatar: user.avatar,
                        email: user.email,
                        userId: user.id,
                        isButtonsVisible: this.authStateService.currentUser ? true : false,
                        isOpenBUDashboardButtonVisible: user.followingStatus === FollowingStatus.FOLLOWING,
                    });
                    this.carouselItems.push(carouselItem);
                }
            },
            error: (err) => {
                this.toastr.error('Failed to get coaches');
                console.log('getAllBusinessUsersByCompanyId', err);
            }
        }); 
    }

    listenWhenUserNotificationsArrived() {
        if (!this.authStateService.currentUser) {
            return;
        }
        this.ngUnsubscribeNotifications = new Subject();
        this.notificationStateService.userNotificationArrived.pipe(takeUntil(this.ngUnsubscribeNotifications)).subscribe(
            {
                next: (notification: WSNotificationContent) => {
                    // If business user accept follow request then reload business users
                    // to hide follow and show schedule training button in the user info card
                    if (notification.type === NotificationType.FOLLOW_REQUEST_ACCEPTED) {
                        this.getAllBusinessUsersByCompanyId();
                        // Fetch companies to see their following status on the map
                        this.companiesStateService.getAllCompanies();
                    }
                }
            }
        );
    }

    unsubscribeFromNotifications() {
		this.ngUnsubscribeNotifications.next(null);
		this.ngUnsubscribeNotifications.complete();
    }

    onCompanySectionToggled(sectionItem: CollapseItem) {
        this.selectedSection = sectionItem;
        if (sectionItem.isOpened) {
            this.companiesStateService.selectedCompany = sectionItem.data;
        } else {
            this.companiesStateService.selectedCompany = null;
            this.carouselItems = [];
        }
        this.getAllBusinessUsersByCompanyId();
    }
}
