import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-search-filter',
  template: `
    <mat-form-field class="table-search">
        <mat-label>{{label}}</mat-label>
        <input matInput (keyup)="applyFilter.emit($event)" placeholder="{{placeholderText}}" #input>
    </mat-form-field>
  `,
   styles: [`
    .table-search {
        width: 100%;

        ::ng-deep {
            .mdc-text-field--filled {
                background-color: white !important;
            }
        }
    }
  `]
})
export class TableSearchFilterComponent {
    @Input() placeholderText: string = '';
    @Input() label: string = 'Filter';
    @Output() applyFilter: EventEmitter<Event> = new EventEmitter();
}
