import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { IOption } from 'src/app/_interfaces/option';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
})
export class MultiSelectDropdownComponent {
    @Input() set preselectDropdown(options: IOption[]) {
        this.selectedOptions = options;
        this.makeSelectedText();
    }
    @Input() label: string = '';
    @Input() errorMessage: string = 'Required field';
    @Input() placeholderText: string = '';
    @Input() elements: IOption[] = [];
    @Input() canValidate!: boolean;
    @Input() disabled: boolean = false;
    @Input() isOpen: boolean = false;
    @Input() isMandatory!: boolean;
    @Output() selectionChanged = new EventEmitter<IOption[]>();

    selectedOptions: IOption[] = [];
    selectedText: string = '';

    // Props used to close a dropdown when the user clicks somewhere outside
    @ViewChild('multiselectDropdown') dropdownRef!: ElementRef;
    @HostListener('document:mousedown', ['$event'])
    onOutsideClick(event: any): void {
        if (!this.dropdownRef?.nativeElement.contains(event.target) && this.isOpen) {
            console.log('onOutsideClick');
            this.isOpen = false;
        }
    }

    toggleDropdown() {
        // console.log('toggleDropdown');
        this.isOpen = !this.isOpen;
    }

    selectOption(option: IOption) {
        if (this.disabled) {
          return;
        }
        option.checked = !option.checked;

        if (option.checked) {
            this.selectedOptions.push(option);
        } else {
            const removeIndex = this.selectedOptions.findIndex((el: IOption) => el.displayValue === option.displayValue && !option.checked);
            if (removeIndex !== -1) {
                this.selectedOptions.splice(removeIndex, 1);
            }
        }

        // console.log('selectOptions', this.selectedOptions);
        this.makeSelectedText();
    
        this.selectionChanged.emit(this.selectedOptions);
    }

    makeSelectedText() {
        if (!this.selectedOptions.length) {
            this.selectedText = '';
            return;
        }
        this.selectedText = '';

        for (let index = 0; index < this.selectedOptions.length; index++) {
            const element = this.selectedOptions[index];
            this.selectedText = index === 0 ? `${element.displayValue}` : `${this.selectedText}, ${element.displayValue}`;
        }
    }
}
