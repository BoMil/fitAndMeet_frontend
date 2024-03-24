import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../_global-state-services/auth/auth-state.service';
import { Auth } from '../_enums/auth';
import { RoleEnum } from '../_enums/user-role';

export const homePageGuard: CanActivateFn = (route, state) => {
        // 1. Home page should be visible for the end_user and not logged-in visitors
        if (inject(AuthStateService).state === Auth.UNAUTHENTICATED || inject(AuthStateService).currentUser?.role === RoleEnum.END_USER) {
            return true;
        }

        // 2. In case it is a BUSINESS_USER then redirect him to his dashboard
        if (inject(AuthStateService).currentUser?.role === RoleEnum.BUSINESS_USER) {
            inject(Router).navigateByUrl(`/business-user-dashboard/${inject(AuthStateService).currentUser?.id}`);
            return false;
        }
        return false;
};
