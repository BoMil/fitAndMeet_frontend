import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenderEnum } from 'src/app/_enums/gender';
import { RoleEnum, getRoleEnumDisplayValue } from 'src/app/_enums/user-role';
import { IOption } from 'src/app/_interfaces/option';
import { CreateOrUpadateUserRequest } from 'src/app/_interfaces/register-request';
import { User } from 'src/app/_models/user';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { MapService } from 'src/app/_services/map.service';

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styles: [`
    .user-details-form {
        .buttons-container {
            gap: 1rem;
            margin-top: 2rem;
        }
    }
  `]
})
export class UserDetailsFormComponent implements OnInit {
    @Input() userToEdit: User | null = null;
    @Output() cancelPressed: EventEmitter<any> = new EventEmitter();
    @Output() userCreatedOrUpdated: EventEmitter<any> = new EventEmitter();

    isSubmitted: boolean = false;
    dontClearMapOnAddressChange: boolean = false;

    // Map properties
    mapCenter!: google.maps.LatLngLiteral;
    possibleLocations: google.maps.places.AutocompletePrediction[] | null = [];
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPositions: google.maps.LatLngLiteral[] = [];
    addressLat!: number | null;
    addressLong!: number | null;

	passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*([^a-zA-Z\d\s])).{9,}$/;

    userForm = new FormGroup({
		firstName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
		lastName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
		username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		dateOfBirth: new FormControl<Date | null>(null, Validators.required),
		phoneNumber: new FormControl<any>('', [Validators.required, Validators.minLength(3)]),
		// gender: new FormControl<GenderEnum>(GenderEnum.UNDEFINED, [Validators.required]),
		// role: new FormControl<RoleEnum>(RoleEnum.END_USER, [Validators.required]),
		password: new FormControl<string>('', this.userToEdit ? [
			Validators.required,
			Validators.pattern(this.passwordRegEx),
		] : null),
		address: new FormControl<string>('', [Validators.required]),
	});
    selectedGender: IOption | null = null;
    genderOptions: IOption[] = [
        { displayValue: GenderEnum.MALE, value: GenderEnum.MALE },
        { displayValue: GenderEnum.FEMALE, value: GenderEnum.FEMALE },
    ];
    selectedRole: IOption | null = null;
    roleOptions: IOption[] = [
        { displayValue:'Business user', value: RoleEnum.BUSINESS_USER },
        { displayValue:'End user', value: RoleEnum.END_USER },
        { displayValue:'Super user', value: RoleEnum.SUPER_USER },
    ];

    constructor(
        public mapService: MapService,
        private geocodingService: GeocodingService,
        private toastr: ToastrService,
        private userApiService: UserApiService,
        // private companyApiService: CompanyApiService,
    ) {}

    ngOnInit(): void {
        this.mapCenter = this.mapService.center;
        this.preselectForm();
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

    roleSelected(role: IOption) {
        this.selectedRole = role;
    }

    selectLocation(location: google.maps.places.AutocompletePrediction) {
        this.userForm.controls.address.setValue(location.description ?? '');
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
                this.userForm.controls.address.setValue(data[0].formatted_address);
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

    cancel() {
        this.cancelPressed.emit();
    }

    submitForm() {
		this.isSubmitted = true;

        if (!this.userToEdit) {
            this.createNewUser();
        } else {
            this.updateUser();
        }
    }

    updateUser() {
        if (this.userForm.status !== 'VALID' || !this.selectedGender || !this.selectedRole || !this.addressLong || !this.addressLat || !this.userToEdit) {
            return;
        }

        let request: CreateOrUpadateUserRequest = {
            first_name: this.userForm.controls.firstName.value ?? '',
            last_name: this.userForm.controls.lastName.value ?? '',
            user_name: this.userForm.controls.username.value ?? '',
            email: this.userForm.controls.email.value ?? '',
            gender: this.selectedGender.value ? this.selectedGender.value?.toString() : '',
            avatar: '',
            date_of_birth: this.userForm.controls.dateOfBirth.value ? this.userForm.controls.dateOfBirth.value.toISOString() : '',
            phone_number: this.userForm.controls.phoneNumber?.value?.e164Number ?? '',
            address: this.userForm.controls.address.value ?? '',
            lat: this.addressLat,
            long: this.addressLong,
            role: this.selectedRole.value ? this.selectedRole.value?.toString() : '',
            // password: this.userForm.controls.password.value ?? '',
        }


        this.userApiService.updateUser(request, this.userToEdit.id).subscribe({
			next: (data: any) => {
                this.userCreatedOrUpdated.emit();
        console.log('userCreatedOrUpdated form');
                this.toastr.success('User updated successfully');
                this.isSubmitted = false;
			},
			error: (err: any) => {
                this.toastr.error('User updated failed');
            },
		});
    }

    createNewUser() {
		if (this.userForm.status !== 'VALID' || !this.selectedGender || !this.selectedRole || !this.addressLong || !this.addressLat) {
			return;
		}

        let request: CreateOrUpadateUserRequest = {
            first_name: this.userForm.controls.firstName.value ?? '',
            last_name: this.userForm.controls.lastName.value ?? '',
            user_name: this.userForm.controls.username.value ?? '',
            email: this.userForm.controls.email.value ?? '',
            gender: this.selectedGender.value ? this.selectedGender.value?.toString() : '',
            avatar: '',
            date_of_birth: this.userForm.controls.dateOfBirth.value ? this.userForm.controls.dateOfBirth.value.toISOString() : '',
            phone_number: this.userForm.controls.phoneNumber?.value?.e164Number ?? '',
            address: this.userForm.controls.address.value ?? '',
            lat: this.addressLat,
            long: this.addressLong,
            password: this.userForm.controls.password.value ?? '',
            role: this.selectedRole.value ? this.selectedRole.value?.toString() : '',
        }

        this.userApiService.registerUser(request).subscribe({
			next: (data: any) => {
                this.userCreatedOrUpdated.emit();
        console.log('userCreatedOrUpdated form');

                this.toastr.success('Registration successful');
                this.isSubmitted = false;
			},
			error: (err: any) => {
                this.toastr.error('Registration failed');
            },
		});
    }

    preselectForm() {
        if (!this.userToEdit) {
            return;
        }

        this.userForm.controls.firstName.setValue(this.userToEdit.first_name ?? '');
        this.userForm.controls.lastName.setValue(this.userToEdit.last_name ?? '');
        this.userForm.controls.username.setValue(this.userToEdit.user_name ?? '');
        this.userForm.controls.email.setValue(this.userToEdit.email ?? '');
        this.userForm.controls.phoneNumber.setValue(this.userToEdit.phone_number ?? '');
        this.selectedGender = {
            value: this.userToEdit.gender,
            displayValue: this.userToEdit.gender,
        };
        this.selectedRole = {
            value: this.userToEdit.role,
            displayValue: getRoleEnumDisplayValue(this.userToEdit.role)
        };
        this.userForm.controls.address.setValue(this.userToEdit.address ?? '');
        if (this.userToEdit.date_of_birth) {
            this.userForm.controls.dateOfBirth.setValue(new Date(this.userToEdit.date_of_birth));
        }

        // Set user address on the map
        if (this.userToEdit.lat && this.userToEdit.long) {
            this.addressLat = Number(this.userToEdit.lat);
            this.addressLong = Number(this.userToEdit.long);
            this.moveMapToAddressLocation();
        }
    }

    // getRoleDisplayValue
}
