import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-label',
  template: `
    <span class="label" [ngStyle]="{'font-weight': bolded ? 600 : 500}">
        {{ label }}<span *ngIf="isMandatory" class="mandatory">*</span>
    </span
    >
  `,
  styles: [
    `
      .label {
        font-size: 14px;
        color: var(--text-primary);
        margin-bottom: 0.4rem;

        .mandatory {
          color: var(--red-mandatory);
        }
      }
    `,
  ],
})
export class InputLabelComponent {
  @Input() label: string = '';
  @Input() isMandatory!: boolean;
  @Input() bolded!: boolean;
}
