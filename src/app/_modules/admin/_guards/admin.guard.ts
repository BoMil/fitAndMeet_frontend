import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/_enums/auth';
import { AdminAuthStateService } from '../_global_state_services/auth/admin-auth-state.service';

export const adminGuard: CanActivateFn = (route, state) => {
    // 1. If the user is not logged in leave him on the login page
    if (inject(AdminAuthStateService).state === Auth.UNAUTHENTICATED) {
        return true;
    }
    // 2. Othervise redirect him to the admin dashboard
    inject(Router).navigateByUrl(`admin/dashboard`);
    return false;
};
