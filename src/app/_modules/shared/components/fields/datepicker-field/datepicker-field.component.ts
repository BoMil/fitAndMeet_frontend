import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker-field',
  template: `
    <div class="datepicker-box">
      <app-input-label
        [label]="label"
        [isMandatory]="isMandatory"
      ></app-input-label>

      <mat-form-field appearance="fill">
        <input
          readonly
          matInput
          [matDatepicker]="picker"
          [formControl]="date"
          placeholder="{{ placeholderText }}"
        />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker touchUi startView="multi-year"></mat-datepicker>
      </mat-form-field>
      <div *ngIf="canValidate && date.invalid" class="form-control-error">
          {{ emptyFieldError }}
        </div>
    </div>
  `,
	styleUrls: ['./datepicker-field.component.scss',],
})
export class DatepickerFieldComponent {
  @Input() label: string = '';
  @Input() isMandatory!: boolean;
  @Input() canValidate!: boolean;
  @Input() emptyFieldError: string = 'Required field';
  @Input() errorMessage: string = '';
  @Input() date: FormControl<Date | null> = new FormControl();
  @Input() placeholderText: string = '';
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();
}
