import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITextFieldValue } from '../../../_interfaces/text-field-value';
import { HelperService } from 'src/app/common/services/helper.service';
// import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-input-field',
  template: `
    <div class="text-field" >
      <app-input-label [label]="label" [isMandatory]="isMandatory" />

      <div class="input-container">
        <span (click)="increaseNumber()" *ngIf="type === 'number' && showArrows" class="arrow-custom --small up"></span>
        <input
            name="inputText"
            [ngClass]="{ invalidField: canValidate && inputText.invalid }"
            [formControl]="inputText"
            type="{{ type }}"
            placeholder="{{ placeholderText }}"
            pattern="{{ regex }}"
            (ngModelChange)="inputValueChanged()"
        />
        <span (click)="decreaseNumber()" *ngIf="type === 'number' && showArrows" class="arrow-custom --small down"></span>
      </div>

      <div [class.hidden]="inputText.valid || !canValidate" class="form-control-error" >
        {{ inputText.value?.length ? errorMessage : emptyFieldError }}
      </div>
    </div>
  `,
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() placeholderText: string = '';
  @Input() regex: string = '';
  @Input() emptyFieldError: string = 'Required field';
  @Input() errorMessage: string = '';
  @Input() canValidate!: boolean;
  @Input() inputText: FormControl = new FormControl('');
  @Input() isMandatory!: boolean;
  @Input() type: 'text' | 'number' = 'text';
  @Input() showArrows: boolean = true;
  @Input() set disabled(disable: boolean) {
    if (disable) {
        this.inputText.disable();
    } else {
        this.inputText.enable();
    }
  }
  @Input() set preselectInput(value: string | number | null) {
    // console.log('InputFieldComponent preselectInput', value);
    this.inputText.setValue(value);
  }
  @Output() valueChanged = new EventEmitter<ITextFieldValue>();

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private helperService: HelperService
    ) {}

  ngOnInit(): void {

    this.inputText.valueChanges.subscribe((value) => {
        if (this.disabled) {
            return;
        }
      this.valueChanged.emit({ value: value, isValid: this.inputText?.errors === null });
      
      // console.log('onModelChange TextFieldComponent', { value: value, isValid: this.inputText?.errors === null });
    });
  }

  ngAfterViewChecked(): void {
    // Fix for NG0100: Expression has changed after it was checked error
    this.changeDetectorRef.detectChanges();
  }


  onModelChange(value: any) {
    // if (this.disabled) {
    //     this.inputText.disable();
    //     return;
    // }
    this.valueChanged.emit(value);
    // console.log('onModelChange', value);
  }

  increaseNumber() {
    this.inputText.setValue(Number(this.inputText.value) + 1);
  }

  decreaseNumber() {
    this.inputText.setValue(Number(this.inputText.value) - 1);
  }

  inputValueChanged() {
    if (this.type !== 'number') {
        return;
    }
    let maxValue: number | undefined = this.helperService.getMaxFormControlValue(this.inputText);
    let minValue: number | undefined = this.helperService.getMinFormControlValue(this.inputText);

    if (maxValue !== undefined && Number(this.inputText.value) > maxValue) {
        this.inputText.setValue(maxValue);
    }

    if (minValue !== undefined && Number(this.inputText.value) < minValue) {
        this.inputText.setValue(minValue);
    }
  }
}
