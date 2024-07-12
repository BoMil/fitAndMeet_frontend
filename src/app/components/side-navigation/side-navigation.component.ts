import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidenavItem } from '../../_interfaces/sidenav-Item';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../../_global-state-services/auth/auth-state.service';
import { Auth } from '../../_enums/auth';
import { RoleEnum } from '../../_enums/user-role';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'side-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss'
})
export class SideNavigationComponent implements OnInit {
    // @Output() sidenavToggled = new EventEmitter<boolean>();
    opened: boolean = true;
    sidenavItems: SidenavItem[] = [
        {
            title: 'Mapa',
            selected: true
        }
    ];
	ngUnsubscribe = new Subject();
	private navigationLocalStorageKey: string = 'selectedMenu';


    constructor(
        private router: Router,
        public authStateService: AuthStateService
    ) {}

    ngOnInit(): void {
        this.initializeSidenavNavigation();
        this.listenAuthStateChanges();
    }

    toggleSidenav() {
        this.opened = !this.opened;
        // this.sidenavToggled.emit(this.opened);
    }

    selectNavItem(item: SidenavItem) {
        for (let index = 0; index < this.sidenavItems.length; index++) {
            const element = this.sidenavItems[index];
            if (element.title === item.title) {
                element.selected = true;
            } else {
                element.selected = false;
            }
        }

        switch (item.title) {
            case 'Mapa':
                localStorage.setItem(this.navigationLocalStorageKey, 'Mapa');
                this.router.navigateByUrl('');
                break;
            case 'Moj raspored':
                localStorage.setItem(this.navigationLocalStorageKey, 'Moj raspored');
                break;
            case 'Moji treneri':
                localStorage.setItem(this.navigationLocalStorageKey, 'Moji treneri');
                this.router.navigateByUrl(`/moji-treneri`);
        }

    }

    initializeSidenavNavigation() {
        let selectedItem: string | null = localStorage.getItem(this.navigationLocalStorageKey);

        if (this.authStateService.state === Auth.AUTHENTICATED) {
            if (this.authStateService.currentUser?.role === RoleEnum.END_USER) {
                this.sidenavItems = [
                    {
                        title: 'Mapa',
                        selected: selectedItem ? (selectedItem === 'Mapa' ? true : false) : true
                    },
                    {
                        title: 'Moj raspored',
                        selected: selectedItem ? (selectedItem === 'Moj raspored' ? true : false) : false
                    },
                    {
                        title: 'Moji treneri',
                        selected: selectedItem ? (selectedItem === 'Moji treneri' ? true : false) : false
                    },
                ];
            } else {
                this.sidenavItems = [
                    {
                        title: 'Mapa',
                        selected: selectedItem ? (selectedItem === 'Mapa' ? true : false) : true
                    },
                    {
                        title: 'Moj raspored',
                        selected: selectedItem ? (selectedItem === 'Moj raspored' ? true : false) : false
                    },
                ];
            }
        } else {
            this.sidenavItems = [
                {
                    title: 'Mapa',
                    selected: true
                }
            ]
        }
    }

    listenAuthStateChanges() {
        // Listen when user login/logout
        this.authStateService.authStateChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            {
                next: (state: Auth) => {
                    this.initSidenavOnAuthChange();
                    this.initializeSidenavNavigation();
                }
            }
        );
    }

    initSidenavOnAuthChange() {
        switch (this.authStateService.state) {
            case Auth.UNAUTHENTICATED:
                localStorage.setItem(this.navigationLocalStorageKey, 'Mapa');
                break;
            case Auth.AUTHENTICATED:
                if (this.authStateService.currentUser?.role === RoleEnum.END_USER) {
                    localStorage.setItem(this.navigationLocalStorageKey, 'Moji treneri');
                } else {
                    localStorage.setItem(this.navigationLocalStorageKey, 'Moj raspored');
                }
        }
    }

}
