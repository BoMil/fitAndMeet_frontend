import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea-field',
  template: `
    <div class="textarea-container">
        <mat-form-field >
            <app-input-label [label]="label" [isMandatory]="isMandatory" />

            <textarea
                [ngClass]="{ invalidField: canValidate && inputText.invalid }"
                [formControl]="inputText"
                matInput
                placeholder="{{placeholderText}}">
            </textarea>
        </mat-form-field>
        <div [class.hidden]="inputText.valid || !canValidate" class="form-control-error" >
            {{ inputText.value?.length ? errorMessage : emptyFieldError }}
        </div>
    </div>

  `,
  styleUrls: ['./textarea-field.component.scss']
})
export class TextareaFieldComponent {
    @Input() label: string = '';
    @Input() placeholderText: string = '';
    @Input() emptyFieldError: string = 'Required field';
    @Input() errorMessage: string = '';
    @Input() canValidate!: boolean;
    @Input() inputText: FormControl = new FormControl('');
    @Input() isMandatory!: boolean;
}
