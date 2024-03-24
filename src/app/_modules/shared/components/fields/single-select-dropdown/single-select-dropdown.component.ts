import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IOption } from 'src/app/_interfaces/option';

@Component({
  selector: 'app-single-select-dropdown',
  templateUrl: './single-select-dropdown.component.html',
})
export class SingleSelectDropdownComponent {
  @Input() label: string = '';
  @Input() errorMessage: string = 'Required field';
  @Input() placeholderText: string = '';
  @Input() elements: IOption[] = [];
  @Input() canValidate!: boolean;
  @Input() disabled: boolean = false;
  @Input() isOpen: boolean = false;
  // @Input() dropdownType: DropdownType = 'plain';
  @Input() dropdownMenuMinWidth: string | null = '100%';
  @Input() dropdownMenuMaxHeight!: string | null;
  @Input() dropdownWidth: string = '100%';
  @Input() dropdownMinWidth: string = 'max-content';
  @Input() dropdownHeight: string = '50px';
  @Input() isMandatory!: boolean;

  //   @Input() menuAllign: 'left' | 'right' = 'right';
  @Input() isOptionBorderVisible: boolean = false;

  @Input('preselectedOption') set preselectedOption(value: IOption | null) {
    this.selectedOption = value;
  }

  @Output() selectionChanged = new EventEmitter<IOption>();

  // Props used to close a dropdown when the user clicks somewhere outside
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: any): void {
    if (!this.dropdownRef?.nativeElement.contains(event.target) && this.isOpen) {
      this.isOpen = false;
    }
  }

  selectedOption!: IOption | null;
  menuPosition: string = 'unset';

  ngOnInit(): void {
    // Preselect value
    if (this.preselectedOption != null) {
      this.selectedOption = this.preselectedOption;
    }
    // this.calculateMenuPosition();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: IOption) {
    if (this.disabled) {
      return;
    }
    this.selectedOption = option;
    // this.toggleDropdown();

    this.selectionChanged.emit(this.selectedOption);
  }
}
