import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CountryISO, NgxIntlTelInputComponent, SearchCountryField } from 'ngx-intl-tel-input';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';

@Component({
  selector: 'app-international-phone',
  template: `
    <div class="phone-container">
      <app-input-label
        [label]="label"
        [isMandatory]="isMandatory"
      ></app-input-label>

      <ngx-intl-tel-input
        #phoneInt
        [formControl]="phoneNumber"
        [preferredCountries]="[CountryISO.Serbia]"
        [enableAutoCountrySelect]="false"
        [enablePlaceholder]="true"
        [searchCountryFlag]="true"
        [searchCountryField]="[
          SearchCountryField.Iso2,
          SearchCountryField.Name
        ]"
        [selectFirstCountry]="false"
        [selectedCountryISO]="selectedCountry"
        [maxLength]="15"
        [phoneValidation]="true"
        [separateDialCode]="true"
      ></ngx-intl-tel-input>
      <div *ngIf="phoneNumber.invalid" class="form-control-error" >
        <ng-container *ngIf="canValidateEmptyField && phoneNumber.value === null">{{ emptyFieldError }}</ng-container>
        <ng-container *ngIf="canValidatePhoneNumber && phoneNumber.value !== null">{{ errorMessage }}</ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./international-phone.component.scss'],
})
export class InternationalPhoneComponent implements AfterViewInit, AfterViewChecked {
  @Input() phoneNumber: FormControl = new FormControl('');
  @Input() label: string = '';
  @Input() isMandatory!: boolean;
  @Input() canValidateEmptyField!: boolean;
  @Input() canValidatePhoneNumber!: boolean;
  @Input() emptyFieldError: string = 'Required field';
  @Input() errorMessage: string = 'Invalid phone number';
  @Input() set selectedDialCode(dialCode: string | null) {
    this.dialCode = dialCode;
    this.preselectCountry(dialCode);
  }
  @ViewChild('phoneInt', {static:false}) phoneInt! : NgxIntlTelInputComponent;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  selectedCountry: CountryISO = CountryISO.Serbia;
  dialCode: string | null = null;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.preselectCountry(this.dialCode);
  }

  ngAfterViewChecked(): void {
    // Fix for NG0100: Expression has changed after it was checked error
    this.changeDetectorRef.detectChanges();
  }

  preselectCountry(dialCode: string | null) {
    if (dialCode && this.phoneInt) {
        const country: Country | undefined = this.phoneInt.allCountries.find((el: any) => el.dialCode === dialCode);
        if (country !== undefined) {
            let enumKey = Object.values(CountryISO)[Object.values(CountryISO).indexOf(country.iso2 as CountryISO)];
            const countryEnum: CountryISO | undefined = Object.values(CountryISO).find((value: any, index) => {
                return value === enumKey
            });
            if (countryEnum !== undefined) {
                this.selectedCountry = countryEnum;
            }
        }
    }
  }

    // onchange(event: any) {
    //     console.log('onchange phoneInt', this.phoneInt);
    //     console.log('onchange event', event);
    // }
}
