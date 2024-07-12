import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenderEnum } from 'src/app/_enums/gender';
import { RoleEnum } from 'src/app/_enums/user-role';
import { AuthStateService } from 'src/app/_global-state-services/auth/auth-state.service';
import { LoginRequest } from 'src/app/_interfaces/login-request';
import { IOption } from 'src/app/_interfaces/option';
import { CreateOrUpadateUserRequest } from 'src/app/_interfaces/register-request';
import { AuthApiService } from 'src/app/_services/api-services/auth-api.service';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { ModalService } from 'src/app/_services/modal.service';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { MapService } from 'src/app/_services/map.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AzureBlobService } from '../../_services/blob-storage.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss', '../../common/modal/modal.component.scss'],
    animations: [
        trigger('loginRegister', [
            // Info section animation
            state('moveInfoRight', style({
                transform: 'translateX(234%)'
            })),
            state('moveInfoLeft', style({
                transform: 'translateX(0%)'
            })),
            transition('moveInfoRight => moveInfoLeft', [
              animate('0.5s')
            ]),
            transition('moveInfoLeft => moveInfoRight', [
              animate('0.5s')
            ]),

            // Form animation
            state('moveFormLeft', style({
                transform: 'translateX(0%)'
            })),
            state('moveFormRight', style({
                transform: 'translateX(43%)'
            })),
            transition('moveFormLeft => moveFormRight', [
                animate('0.5s')
            ]),
            transition('moveFormRight => moveFormLeft', [
                animate('0.5s')
            ]),
          ]),
    ]
})
export class SignInComponent implements OnInit, OnDestroy {
	passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*([^a-zA-Z\d\s])).{9,}$/;

	loginForm = new FormGroup({
		username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(20),
			Validators.pattern(this.passwordRegEx),
		]),
	});

    registerForm = new FormGroup({
		firstName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
		lastName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
		username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		dateOfBirth: new FormControl<Date | null>(null, Validators.required),
		phoneNumber: new FormControl<any>('', [Validators.required, Validators.minLength(3)]),
		gender: new FormControl<GenderEnum>(GenderEnum.UNDEFINED, [Validators.required]),
		role: new FormControl<RoleEnum>(RoleEnum.END_USER, [Validators.required]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(this.passwordRegEx),
		]),
		address: new FormControl<string>('', [Validators.required]),
	});
	isSubmitted: boolean = false;
    isLoginForm: boolean = true;
    isStreetNumberDisabled: boolean = true;
    genderOptions: IOption[] = [
        { displayValue: GenderEnum.MALE, value: GenderEnum.MALE },
        { displayValue: GenderEnum.FEMALE, value: GenderEnum.FEMALE },
    ];
    selectedGender: IOption | null = null;

    infoText: string = 'If you don\'t have an account then Sign Up.';
    infoButtonText: 'Login' | 'Sign Up' = 'Sign Up';
    dontClearMapOnAddressChange: boolean = false;

    possibleLocations: google.maps.places.AutocompletePrediction[] | null = [];
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPositions: google.maps.LatLngLiteral[] = [];
    addressLat!: number | null;
    addressLong!: number | null;
    mapCenter!: google.maps.LatLngLiteral;

    // Used for seting new user role to super_admin
    hiddenBtnPressed: number = 1;
    hiddenButtonTimeout: any;

    avatarImageFile: File | null = null;
    avatarImageUrl: any = '';
    imageUploaded: Subject<any> = new Subject();
	ngUnsubscribe = new Subject();
    fileName: string = '';

	constructor(
		public modalService: ModalService,
		private authApiService: AuthApiService,
		private authStateService: AuthStateService,
        private geocodingService: GeocodingService,
		private userApiService: UserApiService,
        private toastr: ToastrService,
        public mapService: MapService,
        private router: Router,
        private blobStorageService: AzureBlobService,
	) {}

    ngOnInit(): void {
        this.mapCenter = this.mapService.center;
        this.listenWhenImageIsUploadedToAzure();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
    }

    infoBtnPressed() {
        this.isLoginForm = !this.isLoginForm;
        this.isSubmitted = false;
        if (this.isLoginForm) {
            this.infoText = 'If you don\'t have an account then Sign Up';
            this.infoButtonText = 'Sign Up';
        } else {
            this.resetRegisterAddressState();
            this.infoText = 'If you already have an account, just login.';
            this.infoButtonText = 'Login';
        }
    }

	loginPressed() {
		this.isSubmitted = true;
		if (this.loginForm.status !== 'VALID') {
			return;
		}

		let loginRequest: LoginRequest = {
			username: this.loginForm.controls.username.value ?? '',
			password: this.loginForm.controls.password.value ?? '',
		};

		this.authApiService.loginUser(loginRequest).subscribe({
			next: (data: any) => {
                this.toastr.success('Login successful');
				this.authStateService.setAccessTokenToLocalStorage(data.access_token);

                // If user already followed someone (coaches) then redirect him to schedule page
                if (this.authStateService.currentUser?.following.length) {
                    this.router.navigateByUrl(`/moji-treneri`);
                }
				this.closeModal();
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

    registerPressed() {
		this.isSubmitted = true;

		if (this.registerForm.status !== 'VALID' || !this.selectedGender || !this.addressLong || !this.addressLat) {
			return;
		}

        if (this.avatarImageFile) {
            this.uploadImageToAzure();
            return;
        }

        this.registerUserLogic();
    }

	closeModal() {
		this.modalService.closeModal();
	}

    getLocationsBySearchQuery(search: string) {
        this.possibleLocations = [];
        if (!this.dontClearMapOnAddressChange) {
            this.clearMap();
        }

        if (!search || this.dontClearMapOnAddressChange) {
            this.dontClearMapOnAddressChange = false;
            return;
        }

        this.geocodingService.getPlaces(search).subscribe({
			next: (data: google.maps.places.AutocompletePrediction[] | null) => {
                this.possibleLocations = data;
			},
			error: (err: any) => {
                console.error('getLocationsBySearchQuery err', err);
            },
		});
    }

    genderSelected(gender: IOption) {
        this.selectedGender = gender;
    }

    selectLocation(location: google.maps.places.AutocompletePrediction) {
        this.registerForm.controls.address.setValue(location.description ?? '');
        this.dontClearMapOnAddressChange = true;

        // Get lat and long of the selected address
        this.geocodingService.codeAddress(location.description ?? '').subscribe({
			next: (data: google.maps.GeocoderResult[] | null) => {
                if (!data) {
                    this.addressLat = null;
                    this.addressLong = null;
                    return;
                }
                this.addressLat = data[0].geometry.location.lat();
                this.addressLong = data[0].geometry.location.lng();

                // Add marker on the map
                this.moveMapToAddressLocation();
			},
			error: (err: any) => {
                this.clearMap();
                this.toastr.error('Failed to get coordinates from address');
            },
		});
    }

    addMarker(event: google.maps.MapMouseEvent) {
        if (!event || !event.latLng) {
            return;
        }
        this.markerPositions = [];
        this.markerPositions.push(event.latLng.toJSON());

        // Get address from selected coordinates
        this.geocodingService.getLocationFromCoordinates(event.latLng).subscribe({
			next: (data: google.maps.GeocoderResult[] | null) => {
                if (!data) {
                    this.addressLat = null;
                    this.addressLong = null;
                    return;
                }
                this.addressLat = event.latLng?.lat() ?? null;
                this.addressLong = event.latLng?.lng() ?? null;
                this.registerForm.controls.address.setValue(data[0].formatted_address);
                this.dontClearMapOnAddressChange = true;

			},
			error: (err: any) => {
                this.toastr.error('Failed to get address from coordinates');
            },
		});
    }

    moveMapToAddressLocation() {
        if (!this.addressLat || !this.addressLong) {
            return;
        }
        this.mapCenter = { lat: this.addressLat, lng: this.addressLong };

        // Add marker on the map
        this.markerPositions = [];
        this.markerPositions.push(this.mapCenter);
    }

    clearMap() {
        // Remove markers from map
        this.markerPositions = [];
        // Remove coordinates
        this.addressLat = null;
        this.addressLong = null;
    }

    resetRegisterAddressState() {
        this.mapCenter = this.mapService.center;
        this.possibleLocations = [];
        this.registerForm.controls.address.setValue('');
        this.clearMap();
    }

    hiddenButtonPressed() {
        if (this.hiddenBtnPressed === 10) {
            console.log('hiddenButtonPressed', this.hiddenBtnPressed);

            if (this.hiddenButtonTimeout) {
                clearTimeout(this.hiddenButtonTimeout);
            }
            this.hiddenButtonTimeout = setTimeout(() => {
                this.hiddenBtnPressed = 1;
                this.hiddenButtonTimeout = null;
            }, 60000);
            return;
        }
        this.hiddenBtnPressed++;
    }

    registerUserLogic() {
        if (this.registerForm.status !== 'VALID' || !this.selectedGender || !this.addressLong || !this.addressLat) {
			return;
		}

        let request: CreateOrUpadateUserRequest = {
            first_name: this.registerForm.controls.firstName.value ?? '',
            last_name: this.registerForm.controls.lastName.value ?? '',
            user_name: this.registerForm.controls.username.value ?? '',
            email: this.registerForm.controls.email.value ?? '',
            gender: this.selectedGender.value ? this.selectedGender.value?.toString() : '',
            avatar: '',
            date_of_birth: this.registerForm.controls.dateOfBirth.value ? this.registerForm.controls.dateOfBirth.value.toISOString() : '',
            phone_number: this.registerForm.controls.phoneNumber?.value?.e164Number ?? '',
            address: this.registerForm.controls.address.value ?? '',
            lat: this.addressLat,
            long: this.addressLong,
            password: this.registerForm.controls.password.value ?? '',
        }

        if (this.hiddenBtnPressed === 10) {
            request.role = RoleEnum.SUPER_USER;
        }

        this.userApiService.registerUser(request).subscribe({
			next: (data: any) => {
                this.toastr.success('Registration successful');
                this.isLoginForm = true;
                this.isSubmitted = false;
                this.avatarImageFile = null;
                this.avatarImageUrl = '';
			},
			error: (err: any) => {
                this.toastr.error('Registration failed');
            },
		});    
    }

    imageUploadedToBrowser(data: any) {
        this.avatarImageFile = data;
        const reader = new FileReader();

        // Display img on the page
        reader.readAsDataURL(data); 
        reader.onload = (_event) => { 
            this.avatarImageUrl = reader.result ?? '';
        }
    }

    uploadImageToAzure() {
        if (!this.avatarImageFile) {
            return;
        }

        this.blobStorageService.uploadFile(this.avatarImageFile, this.avatarImageFile.name, 'images', (response) => {
            this.avatarImageUrl = response;
            this.imageUploaded.next(true);
        });
    }

    listenWhenImageIsUploadedToAzure() {
        this.imageUploaded.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (data) => {
                this.registerUserLogic();
            }
        });
    }

    updateFileName(name: any) {
        this.fileName = name;
    }
}
