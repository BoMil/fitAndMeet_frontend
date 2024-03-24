import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/_enums/auth';
import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthStateService {
	private userLocalStorageKey: string = 'admin_access_token';
    public authStateChanged: Subject<Auth> = new Subject();
	public state: Auth = Auth.UNAUTHENTICATED;
	public currentUser?: User | null;

    constructor(private router: Router,) {
        this.checkAdminAuthState();
    }

	checkAdminAuthState() {
		let user = this.getUserFromLocalStorage();
		console.log('INIT AUTH_STATE ADMIN', user);
		if (user) {
			this.state = Auth.AUTHENTICATED;
			this.currentUser = user;
		} else {
			this.state = Auth.UNAUTHENTICATED;
			this.currentUser = null;
		}
        this.authStateChanged.next(this.state);
	}

	setAdminAccessTokenToLocalStorage(token: string) {
		this.state = Auth.AUTHENTICATED;
		localStorage.setItem(this.userLocalStorageKey, JSON.stringify(token));
		this.currentUser = this.getUserFromLocalStorage();
        this.authStateChanged.next(this.state);
	}

    getUserFromLocalStorage(): User | null {
        let token: string | null = localStorage.getItem(this.userLocalStorageKey);
        if (!token) {
            return null;
        }
        let decodedObject: any = jwtDecode(token);

		return decodedObject ? new User(decodedObject.user) : null;
	}

    logoutUser() {
		this.state = Auth.UNAUTHENTICATED;
		this.currentUser = null;
		localStorage.removeItem(this.userLocalStorageKey);
        this.authStateChanged.next(this.state);
        this.router.navigateByUrl('admin/login');
	}
}
