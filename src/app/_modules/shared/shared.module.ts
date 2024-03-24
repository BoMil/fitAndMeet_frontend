import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CollapsibleItemComponent } from 'src/app/_modules/shared/components/collapsible-item/collapsible-item.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { InputFieldComponent } from './components/fields/input-field/input-field.component';
import { DatepickerFieldComponent } from './components/fields/datepicker-field/datepicker-field.component';
import { InputLabelComponent } from './components/fields/input-label/input-label.component';
import { InternationalPhoneComponent } from './components/fields/international-phone/international-phone.component';
import { SearchFieldComponent } from './components/fields/search-field/search-field.component';
import { SingleSelectDropdownComponent } from './components/fields/single-select-dropdown/single-select-dropdown.component';
import { MatTableModule } from '@angular/material/table';
import { UsersTableComponent } from './components/tables/users-table/users-table.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CompaniesTableComponent } from './components/tables/companies-table/companies-table.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TextareaFieldComponent } from './components/fields/textarea-field/textarea-field.component';
import { MultiSelectDropdownComponent } from './components/fields/multi-select-dropdown/multi-select-dropdown.component';
import { TableSearchFilterComponent } from './components/fields/table-search-filter/table-search-filter.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    InputFieldComponent,
    InputLabelComponent,
    SearchFieldComponent,
    SingleSelectDropdownComponent,
    DatepickerFieldComponent,
    InternationalPhoneComponent,
    CollapsibleItemComponent,
    UsersTableComponent,
    CompaniesTableComponent,
    TextareaFieldComponent,
    MultiSelectDropdownComponent,
    TableSearchFilterComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ToastrModule.forRoot(),
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    GoogleMapsModule,
    MatSlideToggleModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ToastrModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    GoogleMapsModule,
    MatSlideToggleModule,

    // components
    InputFieldComponent,
    InputLabelComponent,
    SearchFieldComponent,
    SingleSelectDropdownComponent,
    DatepickerFieldComponent,
    InternationalPhoneComponent,
    CollapsibleItemComponent,
    UsersTableComponent,
    CompaniesTableComponent,
    TextareaFieldComponent,
    MultiSelectDropdownComponent,
    TableSearchFilterComponent,

  ]
})
export class SharedModule { }
