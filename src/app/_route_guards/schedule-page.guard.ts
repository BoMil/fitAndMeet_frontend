import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../_global-state-services/auth/auth-state.service';
import { Auth } from '../_enums/auth';
import { RoleEnum } from '../_enums/user-role';

export const schedulePageGuard: CanActivateFn = (route, state) => {
        // 1. Schedule page should be visible only for the end users
        if (inject(AuthStateService).state === Auth.AUTHENTICATED && inject(AuthStateService).currentUser?.role === RoleEnum.END_USER) {
            return true;
        }
        return false;
};
