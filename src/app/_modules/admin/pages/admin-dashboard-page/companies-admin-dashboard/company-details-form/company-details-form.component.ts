import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CreateCompanyRequest } from 'src/app/_interfaces/create-company-request';
import { IOption } from 'src/app/_interfaces/option';
import { Company } from 'src/app/_models/company';
import { CoordinatesModel } from 'src/app/_models/coordinates';
import { User } from 'src/app/_models/user';
import { CompanyApiService } from 'src/app/_services/api-services/company-api.service';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { MapService } from 'src/app/_services/map.service';
import { AzureBlobService } from '../../../../../../_services/blob-storage.service';

@Component({
  selector: 'app-company-details-form',
  templateUrl: './company-details-form.component.html',
  styleUrls: ['./company-details-form.component.scss']
})
export class CompanyDetailsFormComponent implements OnInit, OnDestroy {
    @Input() companyToEdit: Company | null = null;
    @Output() cancelPressed: EventEmitter<any> = new EventEmitter();
    @Output() companyCreatedOrUpdated: EventEmitter<any> = new EventEmitter();

	isSubmitted: boolean = false;
    dontClearMapOnAddressChange: boolean = false;

    // Map properties
    mapCenter!: google.maps.LatLngLiteral;
    possibleLocations: google.maps.places.AutocompletePrediction[] | null = [];
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPositions: google.maps.LatLngLiteral[] = [];
    addressLat!: number | null;
    addressLong!: number | null;

    dropdownBusinessUsers: IOption[] = [];
    preselectedBusinessUsers: IOption[] = [];
    allBusinessUsers: User[] = [];
    selectedBusinessUsersIds: string[] = [];

	companyForm = new FormGroup({
		companyName: new FormControl<string>('', [Validators.required]),
		description: new FormControl<string>('', [ Validators.required ]),
		address: new FormControl<string>('', [ Validators.required ]),
	});

    companyImageFile: File | null = null;
    companyImageUrl: any = '';
    imageUploaded: Subject<any> = new Subject();
	ngUnsubscribe = new Subject();
    fileName: string = '';

    constructor(
        public mapService: MapService,
        private geocodingService: GeocodingService,
        private toastr: ToastrService,
        private userApiService: UserApiService,
        private companyApiService: CompanyApiService,
        private blobStorageService: AzureBlobService,
    ) {}

    ngOnInit(): void {
        this.mapCenter = this.mapService.center;
        this.preselectForm();
        this.getAllBusinessUsers();
        this.listenWhenImageIsUploadedToAzure();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
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

    selectLocation(location: google.maps.places.AutocompletePrediction) {
        this.companyForm.controls.address.setValue(location.description ?? '');
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
                this.companyForm.controls.address.setValue(data[0].formatted_address);
                this.dontClearMapOnAddressChange = true;

			},
			error: (err: any) => {
                this.toastr.error('Failed to get address from coordinates');
            },
		});
    }

    getAllBusinessUsers() {
        this.userApiService.getAllBusinessUsers().subscribe({
            next: (data) => {
                this.allBusinessUsers = [];
                this.dropdownBusinessUsers = [];
                this.preselectedBusinessUsers = [];

                for (let index = 0; index < data.length; index++) {
                    const user: User = new User(data[index]);
                    this.allBusinessUsers.push(user);
                    let isChecked = this.companyToEdit ? Boolean(this.companyToEdit.list_of_business_users_id.find((el: any) => el.toString() === user.id.toString())) : false;
                    const dropdownOption: IOption = {
                        value: user.id,
                        displayValue: user.fullName,
                        checked: isChecked
                    };

                    if (isChecked) {
                        this.preselectedBusinessUsers.push(dropdownOption);
                    }
                    this.dropdownBusinessUsers.push(dropdownOption);
                }
            },
            error: (err) => {
                this.toastr.error('Failed to get coaches');
                console.log('getAllBusinessUsers', err);
            }
        });
    }

    businessUsersSelectionChanged(options: IOption[]) {
        this.selectedBusinessUsersIds = [];
        for (let index = 0; index < options.length; index++) {
            const element = options[index];
            if (element.value) {
                this.selectedBusinessUsersIds.push(element.value.toString());
            }
        }
        // console.log('selectedBusinessUsersIds', this.selectedBusinessUsersIds);

    }

    createNewCompany() {
        if (this.companyForm.status !== 'VALID' || !this.addressLong || !this.addressLat) {
            return;
        }

        if (this.companyImageFile) {
            this.uploadImageToAzure();
            return;
        }

        this.createCompanyLogic();
    }

    cancel() {
        this.cancelPressed.emit();
    }

    submitForm() {
		this.isSubmitted = true;

        if (!this.companyToEdit) {
            this.createNewCompany();
        } else {
            this.updateCompany();
        }
    }

    updateCompany() {
        if (this.companyForm.status !== 'VALID' || !this.addressLong || !this.addressLat || !this.companyToEdit) {
            return;
        }

        if (this.companyImageFile) {
            this.uploadImageToAzure();
            return;
        }

        this.updateCompanyLogic();
    }

    preselectForm() {
        if (!this.companyToEdit) {
            return;
        }

        this.companyForm.controls.companyName.setValue(this.companyToEdit.name ?? '');
        this.companyForm.controls.description.setValue(this.companyToEdit.description ?? '');
        this.companyForm.controls.address.setValue(this.companyToEdit.address ?? '');

        // Set company address on the map
        if (this.companyToEdit.location.lat && this.companyToEdit.location.long) {
            this.addressLat = this.companyToEdit.location.lat;
            this.addressLong = this.companyToEdit.location.long;
            this.moveMapToAddressLocation();
        }

        // Set company business users
        this.selectedBusinessUsersIds = this.companyToEdit.list_of_business_users_id;
        this.companyImageUrl = this.companyToEdit.imageUrl;
    }

    createCompanyLogic() {
        if (this.companyForm.status !== 'VALID' || !this.addressLong || !this.addressLat) {
            return;
        }

        const request: CreateCompanyRequest = {
            list_of_business_users_id: this.selectedBusinessUsersIds,
            name: this.companyForm.controls.companyName.value ?? '',
            address: this.companyForm.controls.address.value ?? '',
            location: new CoordinatesModel({
                lat: this.addressLat,
                long: this.addressLong,
            }),
            description: this.companyForm.controls.description.value ?? '',
            logo: '',
            imageUrl: this.companyImageUrl
        }
        // console.log('request', request);

        this.companyApiService.createCompany(request).subscribe({
            next: (data) => {
                this.companyCreatedOrUpdated.emit();
                this.toastr.success('Company created');
                console.log('createCompany', data);
            },
            error: (err) => {
                this.toastr.error('Failed to create company');
                console.error('createCompany', err);
            }
        });
    }

    updateCompanyLogic() {
        if (this.companyForm.status !== 'VALID' || !this.addressLong || !this.addressLat || !this.companyToEdit) {
            return;
        }

        const request: CreateCompanyRequest = {
            list_of_business_users_id: this.selectedBusinessUsersIds,
            name: this.companyForm.controls.companyName.value ?? '',
            address: this.companyForm.controls.address.value ?? '',
            location: new CoordinatesModel({
                lat: this.addressLat,
                long: this.addressLong,
            }),
            description: this.companyForm.controls.description.value ?? '',
            logo: '',
            imageUrl: this.companyImageUrl
        }
        // console.log('request', request);

        this.companyApiService.updateCompany(request, this.companyToEdit.id).subscribe({
            next: (data) => {
                this.companyCreatedOrUpdated.emit();
                this.toastr.success('Company updated');
                // console.log('updateCompany', data);
            },
            error: (err) => {
                this.toastr.error('Failed to update company');
                console.error('updateCompany', err);
            }
        });
    }

    imageUploadedToBrowser(data: any) {
        this.companyImageFile = data;
        const reader = new FileReader();

        // Display img on the page
        reader.readAsDataURL(data); 
        reader.onload = (_event) => { 
            this.companyImageUrl = reader.result ?? '';
        }
    }

    uploadImageToAzure() {
        if (!this.companyImageFile) {
            return;
        }

        this.blobStorageService.uploadFile(this.companyImageFile, this.companyImageFile.name, 'images', (response) => {
            this.companyImageUrl = response;
            this.imageUploaded.next(true);
        });
    }

    listenWhenImageIsUploadedToAzure() {
        this.imageUploaded.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (data) => {
                if (!this.companyToEdit) {
                    this.createCompanyLogic();
                } else {
                    this.updateCompanyLogic();
                }
            }
        });
    }

    updateFileName(name: any) {
        this.fileName = name;
    }
}
