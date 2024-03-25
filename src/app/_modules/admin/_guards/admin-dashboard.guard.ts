import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthStateService } from '../_global_state_services/auth/admin-auth-state.service';
import { Auth } from 'src/app/_enums/auth';

export const adminDashboarGuard: CanActivateFn = (route, state) => {
    // 1. If the user is not logged in route him to the admin login
    if (inject(AdminAuthStateService).state === Auth.UNAUTHENTICATED) {
        inject(Router).navigateByUrl(`admin/login`);
        return false;
    }

    return true;
};
