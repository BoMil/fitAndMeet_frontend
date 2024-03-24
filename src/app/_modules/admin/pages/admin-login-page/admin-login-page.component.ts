import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from 'src/app/_interfaces/login-request';
import { AuthApiService } from 'src/app/_services/api-services/auth-api.service';
import { AdminAuthStateService } from '../../_global_state_services/auth/admin-auth-state.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss']
})
export class AdminLoginPageComponent {
	loginForm = new FormGroup({
		username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
		password: new FormControl<string>('', [Validators.required]),
	});
    isSubmitted: boolean = false;

    constructor(
        private authApiService: AuthApiService,
		private adminAuthStateService: AdminAuthStateService,
        private router: Router,
        private toastr: ToastrService,
    ) {}

    loginPressed() {
		this.isSubmitted = true;
		if (this.loginForm.status !== 'VALID') {
			return;
		}

		let loginRequest: LoginRequest = {
			username: this.loginForm.controls.username.value ?? '',
			password: this.loginForm.controls.password.value ?? '',
		};

		this.authApiService.loginAdminUser(loginRequest).subscribe({
			next: (data: any) => {
                this.toastr.success('Login successful');
				this.adminAuthStateService.setAdminAccessTokenToLocalStorage(data.access_token);

                // Navigate to the admin dashboard
                this.router.navigateByUrl(`admin/dashboard`);
			},
			error: (err: any) => {
                if (err.error.statusCode === 401) {
                    this.toastr.error('Invalid credentials');
                    return;
                }
                this.toastr.error('Login Failed');
            },
		});
	}
}
