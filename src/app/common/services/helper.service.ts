import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getMaxFormControlValue(control: AbstractControl, fallback?: number): number | undefined {
    const validator = control.validator;
  
    if (validator === null) {
      return fallback;
    }
  
    const errors = validator(new FormControl(Infinity)) ?? {};
    return 'max' in errors ? errors['max']['max'] : fallback;
  }

  getMinFormControlValue(control: AbstractControl, fallback?: number): number | undefined {
    const validator = control.validator;
  
    if (validator === null) {
      return fallback;
    }
  
    const errors = validator(new FormControl(control.value)) ?? {};
    return 'min' in errors ? errors['min']['min'] : fallback;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }
}
