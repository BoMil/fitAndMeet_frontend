import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../_enums/auth';
import { AuthStateService } from '../_global-state-services/auth/auth-state.service';

export const businessDashboardGuard: CanActivateFn = (route, state) => {
    // 1. Business user dashboard can be seen only by logged in user
    if (inject(AuthStateService).state === Auth.UNAUTHENTICATED) {
        inject(Router).navigateByUrl('');
        return false;
    }
    return true;
};
