import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthStateService } from "../_global-state-services/auth/auth-state.service";
import { catchError, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { NotificationsStateService } from "../_global-state-services/notifications/notifications-state.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private notificationsStateService: NotificationsStateService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the local storage
    const accessToken = this.authStateService.getAccessTokenFromLocalStorage();

    if (accessToken) {
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        req = req.clone({
            headers: req.headers.set('Authorization', accessToken)
        });
    }

    // send cloned request with header to the next handler.
    return next.handle(req).pipe(catchError(error => {
        // TODO: Add token refresh functionality, for now logout user after token expired
        if (error instanceof HttpErrorResponse && error.status === 401) {
            this.toastr.warning('Your session expired');
            this.authStateService.logoutUser();
            this.notificationsStateService.closeNotificationsListSidenav();
        }
  
        return throwError(() => error);
    }));;
  }
}