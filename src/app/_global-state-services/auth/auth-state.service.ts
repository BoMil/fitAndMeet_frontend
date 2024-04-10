import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Auth } from 'src/app/_enums/auth';
import { User } from 'src/app/_models/user';
import { jwtDecode } from "jwt-decode";
import { WebsocketService } from 'src/app/_services/websocket-service/websocket.service';

@Injectable({
	providedIn: 'root',
})
export class AuthStateService implements OnInit {
	public currentUser?: User | null;
	public state: Auth = Auth.UNAUTHENTICATED;
    public authStateChanged: Subject<Auth> = new Subject();

	private userLocalStorageKey: string = 'access_token';

    constructor(private websocketService: WebsocketService) {
		this.checkAuthState();
	}

	ngOnInit(): void {
		this.checkAuthState();
	}

	checkAuthState() {
		let user = this.getUserFromLocalStorage();
		// console.log('INIT AUTH_STATE', user);
		if (user) {
			this.state = Auth.AUTHENTICATED;
			this.currentUser = user;
		} else {
			this.state = Auth.UNAUTHENTICATED;
			this.currentUser = null;
		}
        this.authStateChanged.next(this.state);
	}

	setAccessTokenToLocalStorage(token: string) {
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
        // console.log('jwtDecode user', decodedObject);
        // console.log('decodedObject user', new User(decodedObject.user));

		return decodedObject ? new User(decodedObject.user) : null;
	}

	logoutUser() {
		this.state = Auth.UNAUTHENTICATED;
        if (this.currentUser) {
            const userRoomId: string = this.currentUser.id.toString();
            // this.websocketService.leaveRoom(userRoomId);
        }

		this.currentUser = null;

		localStorage.removeItem(this.userLocalStorageKey);
        this.authStateChanged.next(this.state);
	}

    getAccessTokenFromLocalStorage(): string | null {
        let token: string | null = localStorage.getItem(this.userLocalStorageKey);
        return token;
    }
}
